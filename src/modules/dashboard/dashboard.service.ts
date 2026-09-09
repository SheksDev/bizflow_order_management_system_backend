import { prisma } from "@/config/prisma.js";
import { findLedgerAccount } from "../ledgerEntry/ledger.service.js"
import { addMoney, decimal, subtractMoney } from "@/shared/utils/money.js";
import { OrderStatus } from "@prisma/client";
import { calculateExpenseTotal, calculatePaymentTotals } from "@/shared/services/financial/financial.service.js";





export const getDashboardSummaryService = async () => {

    const account = await findLedgerAccount();

    const now = new Date();

    const todayStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
    );

    const tomorrowStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1
    );

    const monthStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
    );

    const nextMonthStart = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        1
    );

    const todayPayments = await prisma.payment.findMany({

        where: {
            paymentDate: {
                gte: todayStart,
                lt: tomorrowStart,
            },
        },

        select: {
            amount: true,
            tipAmount: true,
        },
    });

    const { 
        revenue: todayRevenue,
        tips: todayTips,
    } = calculatePaymentTotals(todayPayments);

    const todayExpenses = await prisma.expense.findMany({

        where: {

            expenseDate: {
                gte: todayStart,
                lt: tomorrowStart,
            },

            deletedAt: null,
        },

        select: {
            amount: true,
            orderNumber: true,
        },
    });

    const {total: todayExpenseTotal} = calculateExpenseTotal(todayExpenses);

    const todayProfit = subtractMoney(todayRevenue, todayExpenseTotal);


    const monthPayments = await prisma.payment.findMany({

        where: {
            paymentDate: {
                gte: monthStart,
                lt: nextMonthStart,
            },
        },

        select: {
            amount: true,
            tipAmount: true,
        },
    });

    const {
        revenue: monthlyRevenue,
        tips: monthlyTips
    } = calculatePaymentTotals(monthPayments);

    const monthExpenses = await prisma.expense.findMany({

        where: {
            expenseDate: {
                gte: monthStart,
                lt: nextMonthStart,
            },

            deletedAt: null,
        },

        select: {
            amount: true,
            orderNumber: true,
        },
    });

    const {
        total: monthlyExpenseTotal
    } = calculateExpenseTotal(monthExpenses);

    const monthlyProfit = subtractMoney(monthlyRevenue, monthlyExpenseTotal);

    const [
        pendingOrders,
        completedOrders,
        cancelledOrders,
    ] = await Promise.all([
        prisma.order.count({

            where: {
                status: OrderStatus.PENDING,
                deletedAt: null,
            },
        }),

        prisma.order.count({

            where: {
                status: OrderStatus.COMPLETED,
                deletedAt: null,
            },
        }),

        prisma.order.count({

            where: {
                status: OrderStatus.CANCELLED,
                deletedAt: null,
            },
        }),
    ]);

    return {
        balance: account.currentBalance,

        today: {
            revenue: todayRevenue,
            expenses: todayExpenseTotal,
            profit: todayProfit,
            tips: todayTips,
        },

        month: {
            revenue: monthlyRevenue,
            expenses: monthlyExpenseTotal,
            profit: monthlyProfit,
        },

        orders: {
            pending: pendingOrders,
            completed: completedOrders,
            cancelled: cancelledOrders,
        },
    };
}