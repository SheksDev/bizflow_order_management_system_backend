import { prisma } from "@/config/prisma.js";
import { Prisma } from "@prisma/client";
import { HTTP_STATUS } from "@/shared/constants/http-status.js";
import { AppError } from "@/shared/errors/AppError.js";
import { CreateExpenseDTO, ExpenseSummaryQueryDTO, GetExpensesQueryDTO, UpdateExpenseDTO } from "./expense.validation.js";
import { generatePublicId } from "@/shared/utils/generate-public-id.js";
import { CounterName } from "@prisma/client";
import { findOrder } from "@/shared/constants/findOrder.js";
import { addMoney, decimal } from "@/shared/utils/money.js";
import { USER_SELECT } from "@/shared/constants/prisma-select.js";




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

        const category = await findCategory(data.expenseCategoryId, tx);

        if (data.orderNumber) {
            const order = await findOrder(data.orderNumber, tx);
        }

        const sequenceExpense = await generatePublicId(tx, CounterName.EXPENSE);
        const expenseId = `EXP-${String(sequenceExpense).padStart(6, "0")}`; 

        return await tx.expense.create({

            data: {
                expenseNumber: expenseId,

                orderNumber: data.orderNumber,

                expenseCategoryId: data.expenseCategoryId,

                title: data.title,

                amount: decimal(data.amount),

                expenseDate: data.expenseDate ?? new Date(),

                description: data.description ?? "",

                receiptUrl: data.receiptUrl ?? "",

                recordedById,
            }
        })
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
            where.expenseDate.gte = startDate;
        }

        if (endDate) {
            where.expenseDate.lte = endDate;
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
            where.expenseDate.gte = startDate;
        }

        if (endDate) {
            where.expenseDate.lte = endDate;
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
        totalExpenses,
        expenseCount: expenses.length,
        byCategory,
    };
}



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