import { prisma } from "@/config/prisma.js";
import { findLedgerAccount } from "../ledgerEntry/ledger.service.js"
import { addMoney, decimal, multiplyMoney, subtractMoney } from "@/shared/utils/money.js";
import { OrderStatus, PaymentStatus } from "@prisma/client";
import { calculateExpenseTotal, calculatePaymentTotals } from "@/shared/services/financial/financial.service.js";
import { getOrderBalance } from "../order/order.controller.js";
import { calculatePercentageChange } from "./dashboard.utils.js";


type DashboardPeriod = 
    | "current_month"
    | "previous_month"
    | "custom";

interface DashboardPeriodResult {
    startDate: Date;
    endDate: Date;
    type: "CURRENT_MONTH" | "PREVIOUS_MONTH" | "CUSTOM";
}

export const getDashboardPeriod = (
    period: DashboardPeriod,
    date?: string,
    month?: string,
) : DashboardPeriodResult => {

    const now = new Date();

    if (period === "current_month") {

        const startDate = new Date (
            now.getFullYear(),
            now.getMonth(),
            1,
        );

        const endDate = new Date (
            now.getFullYear(),
            now.getMonth() + 1,
            1,
        );

        return {
            startDate,
            endDate,
            type: "CURRENT_MONTH",
        }
    }

    if (period === "previous_month") {

        const startDate = new Date (
            now.getFullYear(),
            now.getMonth() - 1,
            1,
        );

        const endDate = new Date (
            now.getFullYear(),
            now.getMonth(),
            1,
        );

        return {
            startDate,
            endDate,
            type: "PREVIOUS_MONTH",
        }
    }

    if (date) {

        const [year, monthNumber, day] = date
            .split("-")
            .map(Number);

        const startDate = new Date(
            year,
            monthNumber - 1,
            day,
        );

        const endDate = new Date(
            year,
            monthNumber - 1,
            day + 1,
        );

        return {
            startDate,
            endDate,
            type: "CUSTOM",
        };
    }

    if (month) {

        const [year, monthNumber] = month
            .split("-")
            .map(Number);

        const startDate = new Date(
            year,
            monthNumber - 1,
            1,
        );

        const endDate = new Date(
            year,
            monthNumber,
            1,
        );

        return {
            startDate,
            endDate,
            type: "CUSTOM",
        };
    }

    throw new Error("Invalid dashboard period");
}





// export const getDashboardSummaryService = async (
//     startDate,
//     endDate
// ) => {

//     const account = await findLedgerAccount();

//     const now = new Date();

//     const todayStart = new Date(
//         now.getFullYear(),
//         now.getMonth(),
//         now.getDate()
//     );

//     const tomorrowStart = new Date(
//         now.getFullYear(),
//         now.getMonth(),
//         now.getDate() + 1
//     );

//     const monthStart = new Date(
//         now.getFullYear(),
//         now.getMonth(),
//         1
//     );

//     const nextMonthStart = new Date(
//         now.getFullYear(),
//         now.getMonth() + 1,
//         1
//     );

//     const todayPayments = await prisma.payment.findMany({

//         where: {
//             paymentDate: {
//                 gte: todayStart,
//                 lt: tomorrowStart,
//             },
//         },

//         select: {
//             amount: true,
//             tipAmount: true,
//         },
//     });

//     const { 
//         revenue: todayRevenue,
//         tips: todayTips,
//     } = calculatePaymentTotals(todayPayments);

//     const todayExpenses = await prisma.expense.findMany({

//         where: {

//             expenseDate: {
//                 gte: todayStart,
//                 lt: tomorrowStart,
//             },

//             deletedAt: null,
//         },

//         select: {
//             amount: true,
//             orderNumber: true,
//         },
//     });

//     const {total: todayExpenseTotal} = calculateExpenseTotal(todayExpenses);

//     const todayProfit = subtractMoney(todayRevenue, todayExpenseTotal);


//     const monthPayments = await prisma.payment.findMany({

//         where: {
//             paymentDate: {
//                 gte: monthStart,
//                 lt: nextMonthStart,
//             },
//         },

//         select: {
//             amount: true,
//             tipAmount: true,
//         },
//     });

//     const {
//         revenue: monthlyRevenue,
//         tips: monthlyTips
//     } = calculatePaymentTotals(monthPayments);

//     const monthExpenses = await prisma.expense.findMany({

//         where: {
//             expenseDate: {
//                 gte: monthStart,
//                 lt: nextMonthStart,
//             },

//             deletedAt: null,
//         },

//         select: {
//             amount: true,
//             orderNumber: true,
//         },
//     });

//     const {
//         total: monthlyExpenseTotal
//     } = calculateExpenseTotal(monthExpenses);

//     const monthlyProfit = subtractMoney(monthlyRevenue, monthlyExpenseTotal);

//     const [
//         totalOrders,
//         pendingOrders,
//         completedOrders,
//         cancelledOrders,
//     ] = await Promise.all([

//         prisma.order.count(),

//         prisma.order.count({

//             where: {
//                 status: OrderStatus.PENDING,
//                 deletedAt: null,
//             },
//         }),

//         prisma.order.count({

//             where: {
//                 status: OrderStatus.COMPLETED,
//                 deletedAt: null,
//             },
//         }),

//         prisma.order.count({

//             where: {
//                 status: OrderStatus.CANCELLED,
//                 deletedAt: null,
//             },
//         }),
//     ]);

//     return {
//         balance: account.currentBalance,

//         today: {
//             revenue: todayRevenue,
//             expenses: todayExpenseTotal,
//             profit: todayProfit,
//             tips: todayTips,
//         },

//         month: {
//             revenue: monthlyRevenue,
//             expenses: monthlyExpenseTotal,
//             profit: monthlyProfit,
//         },

//         orders: {
//             total: totalOrders,
//             pending: pendingOrders,
//             completed: completedOrders,
//             cancelled: cancelledOrders,
//         },
//     };
// }



export const getComparisonPeriod = (
    startDate: Date,
    endDate: Date,
): DashboardPeriodResult => {

    const duration = endDate.getTime() - startDate.getTime();

    const comparisonEndDate = new Date(startDate);

    const comparisonStartDate = new Date(
        startDate.getTime() - duration,
    );

    return {
        startDate: comparisonStartDate,
        endDate: comparisonEndDate,
        type: "CUSTOM",
    };
};



const getDashboardPeriodMetrics = async (
    startDate: Date,
    endDate: Date,
) => {

    const [
        orders,
        payments,
        refunds,
        expenses,
    ] = await Promise.all([

        prisma.order.findMany({

            where: {
                orderDate: {
                    gte: startDate,
                    lt: endDate,
                },
                deletedAt: null,
            },

            select: {
                orderNumber: true,
                status: true,
                currentTotal: true,

                payments: {

                    where: {
                        status: {
                            in: [
                                PaymentStatus.COMPLETED,
                                PaymentStatus.PARTIALLY_REFUNDED,
                                PaymentStatus.REFUNDED,
                            ],
                        },
                    },

                    select: {
                        amount: true,

                        refunds: {
                            select: {
                                amount: true,
                            },
                        },
                    },
                },
            },
        }),

        prisma.payment.findMany({

            where: {

                paymentDate: {
                    gte: startDate,
                    lt: endDate,
                },

                status: {
                    in: [
                        PaymentStatus.COMPLETED,
                        PaymentStatus.PARTIALLY_REFUNDED,
                        PaymentStatus.REFUNDED,
                    ],
                },
            },

            select: {
                amount: true,
                tipAmount: true,
            },
        }),

        prisma.refund.findMany({

            where: {
                refundDate: {
                    gte: startDate,
                    lt: endDate,
                },
            },

            select: {
                amount: true,
            },
        }),

        prisma.expense.findMany({

            where: {

                expenseDate: {
                    gte: startDate,
                    lt: endDate,
                },
                deletedAt: null,
            },

            select: {
                amount: true,
            },
        }),
    ]);

    let pendingOrders = 0;
    let completedOrders = 0;
    let cancelledOrders = 0;

    let grossOrderValue = decimal(0);

    let balanceDue = decimal(0);
    let unpaidBalances = 0;

    let totalPaid = decimal(0);
    let totalRefunded = decimal(0);
    // let totalOps = decimal(0);

    for (const order of orders) {

        switch (order.status) {

            case OrderStatus.PENDING:
                pendingOrders++;
                break;

            case OrderStatus.COMPLETED:
                completedOrders++;
                break;

            case OrderStatus.CANCELLED:
                cancelledOrders++;
                break;
        }

        if (order.status === OrderStatus.CANCELLED){
            continue;
        }

        grossOrderValue = addMoney(grossOrderValue, order.currentTotal);

        for (const payment of order.payments) {

            totalPaid = addMoney(totalPaid, payment.amount);

            for (const refund of payment.refunds) {
                totalRefunded = addMoney(totalRefunded, refund.amount)
            }
        }
        
        const orderBalance = order.currentTotal
            .sub(totalPaid)
            .add(totalRefunded);

        if (orderBalance.gt(0)) {
            
            unpaidBalances++;

            balanceDue = addMoney(balanceDue, orderBalance);
        }
    }

    const activeOrders = pendingOrders + completedOrders;

    let paymentsReceived = decimal(0);
    let tipsReceived = decimal(0);
    let inflow = decimal(0);

    for (const payment of payments) {
        paymentsReceived = addMoney(paymentsReceived, addMoney(payment.amount, payment.tipAmount));
        tipsReceived = addMoney(tipsReceived, payment.tipAmount);
        inflow = addMoney(paymentsReceived, tipsReceived);
    }

    for (const refund of refunds) {
        paymentsReceived = subtractMoney(paymentsReceived, refund.amount);
    }

    let outflow = decimal(0);
    let expenseOutflow = decimal(0);

    for (const expense of expenses) {
        expenseOutflow = addMoney(expenseOutflow, expense.amount);
    }

    outflow = addMoney(expenseOutflow, totalRefunded)
    // totalOps = subtractMoney(outflow, totalRefunded);
    let netRevenue = subtractMoney(paymentsReceived, outflow);
    let totalCashFlow = addMoney(inflow, outflow);

    const inflowPercentage = totalCashFlow.isZero()
        ? decimal(0)
        : multiplyMoney(100, inflow.div(totalCashFlow))

    const outflowPercentage = totalCashFlow.isZero()
        ? decimal(0)
        : multiplyMoney(100, outflow.div(totalCashFlow))

    return {

        orders: {
            active: activeOrders,
            pending: pendingOrders,
            completed: completedOrders,
            cancelled: cancelledOrders,
            unpaidBalances,
        },

        financials: {
            grossOrderValue,
            // paymentsReceived,
            balanceDue,
            inflow: {
                total: inflow,
                orders: paymentsReceived,
                tips: tipsReceived,
            },
            outflow: {
                total: outflow,
                expenses: expenseOutflow,
                refunds: totalRefunded
            },
            outflowEntries: addMoney(expenses.length, refunds.length),
            netRevenue,
            cashFlow: {
                total: totalCashFlow,
                inflow: inflowPercentage.toDecimalPlaces(2),
                outflow: outflowPercentage.toDecimalPlaces(2),
            }
        },
    };
};



export const getDashboardSummaryService = async (
    period: DashboardPeriod,
    date?: string,
    month?: string,
) => {

    const selectedPeriod = getDashboardPeriod(
        period,
        date,
        month,
    );

    const comparisonPeriod = getComparisonPeriod(
        selectedPeriod.startDate,
        selectedPeriod.endDate,
    );

    const [
        selectedMetrics,
        comparisonMetrics,
    ] = await Promise.all([

        getDashboardPeriodMetrics(
            selectedPeriod.startDate,
            selectedPeriod.endDate,
        ),

        getDashboardPeriodMetrics(
            comparisonPeriod.startDate,
            comparisonPeriod.endDate,
        ),
    ]);

    return {

        period: {
            type: selectedPeriod.type,
            startDate: selectedPeriod.startDate,
            endDate: selectedPeriod.endDate,
        },

        orders: selectedMetrics.orders,

        financials: selectedMetrics.financials,

        comparisons: {

            grossOrderValue: calculatePercentageChange(
                selectedMetrics.financials.grossOrderValue,
                comparisonMetrics.financials.grossOrderValue,
            ),

            paymentReceived: calculatePercentageChange(
                selectedMetrics.financials.inflow.total,
                comparisonMetrics.financials.inflow.total,
            ),
        }
    };
};