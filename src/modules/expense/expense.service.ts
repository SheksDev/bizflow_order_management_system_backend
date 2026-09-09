import { prisma } from "@/config/prisma.js";
import { LedgerDirection, LedgerEntryType, LedgerReferenceType, Prisma } from "@prisma/client";
import { HTTP_STATUS } from "@/shared/constants/http-status.js";
import { AppError } from "@/shared/errors/AppError.js";
import { CreateExpenseDTO, ExpenseSummaryQueryDTO, GetExpensesQueryDTO, UpdateExpenseDTO } from "./expense.validation.js";
import { generatePublicId } from "@/shared/utils/generate-public-id.js";
import { CounterName } from "@prisma/client";
import { findOrder } from "@/shared/constants/findOrder.js";
import { addMoney, decimal } from "@/shared/utils/money.js";
import { USER_SELECT } from "@/shared/constants/prisma-select.js";
import { createLedgerEntry, findLedgerAccount, generateLedgerNumber } from "../ledgerEntry/ledger.service.js";
import { getMonthKey } from "@/shared/utils/date.js";



type MonthlyExpense = {
    total: Prisma.Decimal;
    order: Prisma.Decimal;
    business: Prisma.Decimal;
    count: number;
};




const findCategory = async (
    categoryId: string,
    tx?: Prisma.TransactionClient
) => {

    const category = await (prisma || tx).expenseCategory.findUnique({

        where: {
            categoryId: categoryId,
            isActive: true
        }
    });

    if(!category) {
        throw new AppError(`Expense Category ${categoryId} Not Found!`, HTTP_STATUS.NOT_FOUND);
    }

    return category;
}




const findExpense = async (
    expenseNumber: string,
    tx?: Prisma.TransactionClient
) => {

    const expense = await (prisma || tx).expense.findUnique({

        where: {
            expenseNumber,
            deletedAt: null
        },

        include: {
            expenseCategory: true,

            order: {
                select: {
                    orderNumber: true,
                    currentTotal: true,
                    status: true,
                },
            },

            recordedBy: {
                select: USER_SELECT,
            },
        },
    });

    if(!expense) {
        throw new AppError(`Expense ${expenseNumber} Not Found!`, HTTP_STATUS.NOT_FOUND);
    }

    return expense;
}



export const createExpenseService = async (
    data: CreateExpenseDTO,
    recordedById: string
) => {

    return prisma.$transaction(async (tx) => {

        await findCategory(data.expenseCategoryId, tx);

        if (data.orderNumber) {
            await findOrder(data.orderNumber, tx);
        }

        const sequenceExpense = await generatePublicId(tx, CounterName.EXPENSE);
        const expenseId = `EXP-${String(sequenceExpense).padStart(6, "0")}`; 

        const expense = await tx.expense.create({

            data: {
                expenseNumber: expenseId,

                orderNumber: data.orderNumber,

                expenseCategoryId: data.expenseCategoryId,

                title: data.title,

                amount: decimal(data.amount),

                expenseDate: new Date(`${data.expenseDate}`) ?? new Date(),

                description: data.description ?? "",

                receiptUrl: data.receiptUrl ?? "",

                recordedById,
            }
        })

        const entryNumber = await generateLedgerNumber(tx);
        
        const mainCashAccount = await findLedgerAccount(tx);

        await createLedgerEntry(tx, {

            ledgerAccountId: mainCashAccount.id,

            entryNumber,

            type: LedgerEntryType.EXPENSE,

            direction: LedgerDirection.OUT,

            amount: decimal(expense.amount),

            description: `Expense: ${expense.title}`,

            referenceType: LedgerReferenceType.EXPENSE,

            referenceId: expense.id,

            createdById: recordedById,

            orderNumber: expense.orderNumber,
        })

        return expense;
    }, {
        timeout: 10000,
    })
}



export const getExpensesService = async (
    query: GetExpensesQueryDTO
) => {

    const {
        orderNumber,
        expenseCategoryId,
        startDate,
        endDate,
        page,
        limit,
    } = query;

    const where: Prisma.ExpenseWhereInput = {
        deletedAt: null,
    };

    if (orderNumber) {
        where.orderNumber = orderNumber;
    }

    if (expenseCategoryId) {
        where.expenseCategoryId = expenseCategoryId;
    }

    if (startDate || endDate) {
        where.expenseDate = {};

        if (startDate) {
            where.expenseDate.gte = new Date(`${startDate}`);
        }

        if (endDate) {
            where.expenseDate.lte = new Date(`${endDate}`);
        }
    }

    const skip = (page - 1) * limit;

    const [expenses, total] =
        await prisma.$transaction([
            prisma.expense.findMany({
                where,

                include: {
                    expenseCategory: {
                        select: {
                            categoryId: true,
                            name: true,
                        },
                    },

                    order: {
                        select: {
                            orderNumber: true,
                        },
                    },

                    recordedBy: {
                        select: USER_SELECT,
                    },
                },

                orderBy: {
                    expenseDate: "desc",
                },

                skip,
                take: limit,
            }),

            prisma.expense.count({
                where,
            }),
        ]);

    return {
        expenses,

        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}



export const getExpenseService = async (
    expenseNumber: string
) => {

    const expense = await findExpense(expenseNumber);

    return expense;
}



export const getExpenseSummaryService = async (
    query: ExpenseSummaryQueryDTO
) => {

    const {
        startDate,
        endDate,
        orderNumber,
        expenseCategoryId,
    } = query;

    const where: Prisma.ExpenseWhereInput = {
        deletedAt: null,
    };

    if (orderNumber) {
        where.orderNumber = orderNumber;
    }

    if (expenseCategoryId) {
        where.expenseCategoryId = expenseCategoryId;
    }

    if (startDate || endDate) {
        where.expenseDate = {};

        if (startDate) {
            where.expenseDate.gte = new Date(`${startDate}`);
        }

        if (endDate) {
            where.expenseDate.lte = new Date(`${endDate}`);
        }
    }  

    const expenses =
        await prisma.expense.findMany({
            where,

            select: {
                amount: true,

                expenseCategory: {
                    select: {
                        id: true,
                        categoryId: true,
                        name: true,
                    },
                },
            },
        });

    let totalExpenses = decimal(0);

    for (const expense of expenses) {
        totalExpenses = addMoney(totalExpenses, expense.amount);
    }

    const categoryMap =
        new Map<
            string,
            {
                categoryId: string;
                categoryName: string;
                amount: Prisma.Decimal;
                count: number;
            }
        >();

    for (const expense of expenses) {

        const key = expense.expenseCategory.id;

        const existing = categoryMap.get(key);

        if (existing) {

            existing.amount = addMoney(existing.amount, expense.amount);

            existing.count += 1;

        } else {

            categoryMap.set(key, {
                categoryId: expense.expenseCategory.categoryId,

                categoryName: expense.expenseCategory.name,

                amount: expense.amount,

                count: 1,
            });
        }
    }

    const byCategory =
        Array.from(categoryMap.values())
                .sort((a, b) =>
                b.amount.comparedTo(a.amount)
            );

    return {
        period: {
            startDate,
            endDate,
        },
        totalExpenses,
        expenseCount: expenses.length,
        byCategory,
    };
}



export const getMonthlyExpenseReportService = async (
    query: ExpenseSummaryQueryDTO
) => {

    const {
        startDate,
        endDate,
    } = query;

    if (startDate && endDate && startDate >= endDate) {
        throw new AppError(
            "Start date must be before end date",
            HTTP_STATUS.BAD_REQUEST
        );
    }

    const expenses = await prisma.expense.findMany({
        where: {
            deletedAt: null,

            ...(startDate || endDate
                ? {
                    expenseDate: {
                        ...(new Date(`${startDate}`) && {
                            gte: new Date(`${startDate}`),
                        }),

                        ...(new Date(`${endDate}`) && {
                            lt: new Date(`${endDate}`),
                        }),
                    },
                }
                : {}),
        },

        select: {
            amount: true,
            orderNumber: true,
            expenseDate: true,
        },
    });

    const monthly = new Map<string, MonthlyExpense>();

    for (const expense of expenses) {

        const key = getMonthKey(
            expense.expenseDate
        );

        const existing = monthly.get(key);

        if (existing) {

            existing.total = addMoney(
                existing.total,
                expense.amount
            );

            existing.count += 1;

            if (expense.orderNumber) {

                existing.order = addMoney(
                    existing.order,
                    expense.amount
                );

            } else {

                existing.business = addMoney(
                    existing.business,
                    expense.amount
                );
            }

        } else {

            monthly.set(key, {
                total: expense.amount,

                order: expense.orderNumber
                    ? expense.amount
                    : decimal(0),

                business: expense.orderNumber
                    ? decimal(0)
                    : expense.amount,

                count: 1,
            });
        }
    }

    return Array.from(
        monthly.entries()
    ).map(([month, data]) => ({
        month,

        total: data.total,

        order: data.order,

        business: data.business,

        count: data.count,
    }));
};



export const updateExpenseService = async (
    expenseNumber: string, 
    data: UpdateExpenseDTO
) => {

    const expense = await findExpense(expenseNumber);

    if (data.expenseCategoryId) {
        findCategory(data.expenseCategoryId);
    }

    const updateData: Prisma.ExpenseUpdateInput = {

        ...data,
        ...(data.amount !== undefined && {
            amount: decimal(data.amount),
        }),
    };

    return prisma.expense.update({
        
        where: {
            id: expense.id
        },

        data: updateData,
    })
}



export const deleteExpenseService = async (
    expenseNumber: string
) => {

    const expense = await findExpense(expenseNumber);

    return await prisma.expense.update({

        where: {
            id: expense.id,
        },

        data: {
            deletedAt: new Date(),
        },
    });
}