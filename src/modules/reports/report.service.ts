import { prisma } from "@/config/prisma.js";
import { CashFlowReportQueryDTO, ProfitReportQueryDTO } from "./report.validation.js";
import { AppError } from "@/shared/errors/AppError.js";
import { HTTP_STATUS } from "@/shared/constants/http-status.js";
import { LedgerDirection, OrderStatus, Prisma, RefundType } from "@prisma/client";
import { addMoney, decimal, subtractMoney } from "@/shared/utils/money.js";



type MonthlyProfit = {
    revenue: Prisma.Decimal;
    refunds: Prisma.Decimal;
    expenses: Prisma.Decimal;
    orderExpenses: Prisma.Decimal;
    businessExpenses: Prisma.Decimal;
    tips: Prisma.Decimal;
    orderCount: number;
    expenseCount: number;
};



export const getProfitReportService = async (
    query: ProfitReportQueryDTO
) => {

    const {
        startDate,
        endDate,
    } = query;

    if (startDate >= endDate) {
        throw new AppError("Start date must be before end date", HTTP_STATUS.BAD_REQUEST);
    }

    // const orders = await prisma.order.findMany({

    //     where: {
    //         status: OrderStatus.COMPLETED,

    //         deliveryDate: {
    //             gte: startDate,
    //             lt: endDate,
    //         },

    //         deletedAt : null,
    //     },

    //     select: {
    //         id: true,
    //         orderNumber: true,
    //         currentTotal: true,
    //     }
    // });

    const payments = await prisma.payment.findMany({
        where: {
            paymentDate: {
                gte: startDate,
                lt: endDate,
            },
        },

        select: {
            amount: true,
            tipAmount: true,
            paymentDate: true,
        },
    });

    let grossRevenue = decimal(0);
    let tips = decimal(0);

    for (const payment of payments) {

        const tipAmount = payment.tipAmount ?? decimal(0);

        grossRevenue = addMoney(grossRevenue, payment.amount);

        tips = addMoney(tips, tipAmount);
    }

    const refunds = await prisma.refund.findMany({

        where: {
            refundType: RefundType.PAYMENT,

            refundDate: {
                gte: startDate,
                lt: endDate,
            },
        },

        select: {
            amount: true
        },
    });

    let totalRefunded = decimal(0);

    for (const refund of refunds) {
        totalRefunded = addMoney(totalRefunded, refund.amount);
    }

    const netRevenue = subtractMoney(grossRevenue, totalRefunded);

    const expenses = await prisma.expense.findMany({

        where: {
            expenseDate: {
                gte: startDate,
                lt: endDate,
            },

            deletedAt: null,
        },

        select: {
            amount: true,
            orderNumber: true,

            expenseCategory: {
                select: {
                    categoryId: true,
                    name: true,
                },
            },
        },
    });

    let orderExpenses = decimal(0);
    let businessExpenses = decimal(0);

    for (const expense of expenses) {

        if (expense.orderNumber) {
            orderExpenses = addMoney(orderExpenses, expense.amount);
        } else {
            businessExpenses = addMoney(businessExpenses, expense.amount);
        }
    }

    const totalExpenses = addMoney(orderExpenses, businessExpenses);

    const orderCount = await prisma.order.count({
        where: {
            status: OrderStatus.COMPLETED,

            deliveryDate: {
                gte: startDate,
                lt: endDate,
            },

            deletedAt: null,
        },
    });

    const profit = subtractMoney(netRevenue, totalExpenses);

    const profitMargin = netRevenue.isZero()
        ? decimal(0)
        : profit.dividedBy(netRevenue).times(100);

    return {

        period: {
            startDate,
            endDate,
        },

        revenue: {
            gross: grossRevenue,
            refunds: totalRefunded,
            net: netRevenue,
        },

        tips,

        expenses: {
            order: orderExpenses,
            business: businessExpenses,
            total: totalExpenses,
        },

        profit,

        profitMargin,

        orderCount,

        expenseCount: expenses.length,
    }
}



const getMonthsBetween = (
    startDate: Date,
    endDate: Date
) => {
    const months: Date[] = [];

    const current = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        1
    );

    while (current < endDate) {
        
        months.push(new Date(current));

        current.setMonth(
            current.getMonth() + 1
        );
    }

    return months;
};



// const calculateProfitReport = async (
//     startDate: Date,
//     endDate: Date
// ) => {



//     return {
//         revenue,
//         refunds,
//         netRevenue,
//         expenses,
//         orderExpenses,
//         businessExpenses,
//         profit,
//         profitMargin,
//     }
// }



export const getMonthlyProfitReportService = async (
    query: ProfitReportQueryDTO
) => {

    const {
        startDate,
        endDate,
    } = query;

    if (startDate >= endDate) {
        throw new AppError(
            "Start date must be before end date",
            HTTP_STATUS.BAD_REQUEST
        );
    }

    const months = getMonthsBetween(
        startDate,
        endDate
    );

    const monthly = new Map<string, MonthlyProfit>();

    const reports = [];

    for (const month of months) {

        const key =
            `${month.getFullYear()}-${String(
                month.getMonth() + 1
            ).padStart(2, "0")}`;

        monthly.set(key, {
            revenue: decimal(0),
            refunds: decimal(0),
            expenses: decimal(0),
            orderExpenses: decimal(0),
            businessExpenses: decimal(0),
            tips: decimal(0),
            orderCount: 0,
            expenseCount: 0,
        });
    

        const payments = await prisma.payment.findMany({

            where: {
                paymentDate: {
                    gte: startDate,
                    lt: endDate,
                },
            },

            select: {
                amount: true,
                tipAmount: true,
                paymentDate: true,
            },
        });

        const refunds = await prisma.refund.findMany({

            where: {
                refundType: RefundType.PAYMENT,

                refundDate: {
                    gte: startDate,
                    lt: endDate,
                },
            },

            select: {
                amount: true,
                refundDate: true,
            },
        });

        const expenses = await prisma.expense.findMany({

            where: {
                expenseDate: {
                    gte: startDate,
                    lt: endDate,
                },

                deletedAt: null,
            },

            select: {
                amount: true,
                expenseDate: true,
                orderNumber: true,
            },
        });

        const orders = await prisma.order.findMany({

            where: {
                status: OrderStatus.COMPLETED,

                deliveryDate: {
                    gte: startDate,
                    lt: endDate,
                },

                deletedAt: null,
            },

            select: {
                deliveryDate: true,
            },
        });

        const getMonthKey = (date: Date) => {

            return `${date.getFullYear()}-${String(
                date.getMonth() + 1
            ).padStart(2, "0")}`;

        }

        for (const payment of payments) {

            const key = getMonthKey(
                payment.paymentDate
            );

            const month = monthly.get(key);

            if (!month) continue;

            const tipAmount = payment.tipAmount ?? decimal(0);

            month.revenue = addMoney(month.revenue, payment.amount);

            month.tips = addMoney(month.tips, tipAmount);
        }

        for (const refund of refunds) {

            const key = getMonthKey(
                refund.refundDate
            );

            const month = monthly.get(key);

            if (!month) continue;


            month.refunds =
                addMoney(
                    month.refunds,
                    refund.amount
                );
        }

        for (const expense of expenses) {

            const key = getMonthKey(
                expense.expenseDate
            );

            const month = monthly.get(key);

            if (!month) continue;


            month.expenses =
                addMoney(
                    month.expenses,
                    expense.amount
                );


            month.expenseCount++;

            if (expense.orderNumber) {

                month.orderExpenses =
                    addMoney(
                        month.orderExpenses,
                        expense.amount
                    );

            } else {

                month.businessExpenses =
                    addMoney(
                        month.businessExpenses,
                        expense.amount
                    );
            }
        }

        for (const order of orders) {

            const key = getMonthKey(
                order.deliveryDate
            );

            const month = monthly.get(key);

            if (!month) continue;

            month.orderCount++;
        }

        return Array.from(
            monthly.entries()
        ).map(([month, data]) => {

            const netRevenue =
                subtractMoney(
                    data.revenue,
                    data.refunds
                );


            const profit =
                subtractMoney(
                    netRevenue,
                    data.expenses
                );

            const profitMargin =
                netRevenue.isZero()
                    ? decimal(0)
                    : profit
                        .dividedBy(netRevenue)
                        .times(100);

            return {

                month,

                revenue: {
                    gross: data.revenue,
                    refunds: data.refunds,
                    net: netRevenue,
                },

                tips: data.tips,

                expenses: {
                    order: data.orderExpenses,
                    business: data.businessExpenses,
                    total: data.expenses,
                },

                profit,

                profitMargin,

                orderCount:
                    data.orderCount,

                expenseCount:
                    data.expenseCount,
            };
        });
    }
};



export const getCashFlowReportService = async (
    query: CashFlowReportQueryDTO
) => {

    const {
        startDate,
        endDate,
    } = query;

    if (startDate >= endDate) {
        throw new AppError(
            "Start date must be before end date",
            HTTP_STATUS.BAD_REQUEST
        );
    }

    const entries = await prisma.ledgerEntry.findMany({

        where: {
            createdAt: {
                gte: startDate,
                lt: endDate,
            },
        },

        select: {
            type: true,
            direction: true,
            amount: true,
            description: true,
            createdAt: true,
        },

        orderBy: {
            createdAt: "asc",
        },
    });

    let inflow = decimal(0);
    let outflow = decimal(0);

    for (const entry of entries) {

        if (entry.direction === LedgerDirection.IN) {

            inflow = addMoney(
                inflow,
                entry.amount
            );

        } else {

            outflow = addMoney(
                outflow,
                entry.amount
            );
        }
    }

    const netCashFlow = subtractMoney(
        inflow,
        outflow
    );

    const previousEntry = await prisma.ledgerEntry.findFirst({

        where: {
            createdAt: {
                lt: startDate,
            },
        },

        orderBy: {
            createdAt: "desc",
        },

        select: {
            balanceAfter: true,
        },
    });

    const openingBalance = previousEntry?.balanceAfter ?? decimal(0);
    const closingBalance = addMoney(
        openingBalance,
        netCashFlow
    );

    const typeMap = new Map<
        string,
        {
            direction: LedgerDirection;
            amount: Prisma.Decimal;
        }
    >();

    for (const entry of entries) {

        const key = entry.type;

        const existing =
            typeMap.get(key);

        if (existing) {

            existing.amount =
                addMoney(
                    existing.amount,
                    entry.amount
                );

        } else {

            typeMap.set(key, {
                direction: entry.direction,
                amount: entry.amount,
            });
        }
    }

    const byType = Array.from(typeMap.entries())
        .map(([type, data]) => ({
            type,
            direction: data.direction,
            amount: data.amount,
        }));

    return {
        period: {
            startDate,
            endDate,
        },

        openingBalance,

        inflow,

        outflow,

        netCashFlow,

        closingBalance,

        byType,
    };
}