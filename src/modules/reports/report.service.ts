import { prisma } from "@/config/prisma.js";
import { ProfitReportQueryDTO } from "./report.validation.js";
import { AppError } from "@/shared/errors/AppError.js";
import { HTTP_STATUS } from "@/shared/constants/http-status.js";
import { OrderStatus, RefundType } from "@prisma/client";
import { addMoney, decimal, subtractMoney } from "@/shared/utils/money.js";



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

    const orders = await prisma.order.findMany({

        where: {
            status: OrderStatus.COMPLETED,

            deliveryDate: {
                gte: startDate,
                lt: endDate,
            },

            deletedAt : null,
        },

        select: {
            id: true,
            orderNumber: true,
            currentTotal: true,
        }
    });

    let grossRevnue = decimal(0);

    for (const order of orders) {
        grossRevnue = addMoney(grossRevnue, order.currentTotal);
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

    const netRevenue = subtractMoney(grossRevnue, totalRefunded);

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
                gross: grossRevnue,
                refunds: totalRefunded,
                net: netRevenue,
            },

            expenses: {
                order: orderExpenses,
                business: businessExpenses,
                total: totalExpenses,
            },

            profit,

            profitMargin,

            orderCount: orders.length,

            expense: expenses.length,
        }
}