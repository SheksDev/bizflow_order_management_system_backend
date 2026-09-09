import { addMoney, decimal, subtractMoney } from "@/shared/utils/money.js";
import { Prisma } from "@prisma/client"




type PaymentFinancialData = {
    amount: Prisma.Decimal;
    tipAmount: Prisma.Decimal | null;
}

type ExpenseFinancialData = {
    amount: Prisma.Decimal;
    orderNumber: string | null;
};

type RefundFinancialData = {
    amount: Prisma.Decimal;
};



export const calculatePaymentTotals = (
    payments: PaymentFinancialData[]
) => {

    let revenue = decimal(0);
    let tips = decimal(0);

    for (const payment of payments) {

        const tip =
            payment.tipAmount ?? decimal(0);

        revenue = addMoney(
            revenue,
            subtractMoney(
                payment.amount,
                tip
            )
        );

        tips = addMoney(
            tips,
            tip
        );
    }

    return {
        revenue,
        tips,
    };
};



export const calculateExpenseTotal = (
    expenses: ExpenseFinancialData[]
) => {

    let total = decimal(0);
    let orderExpenses = decimal(0);
    let businessExpenses = decimal(0);

    // for (const expense of expenses) {

    //     total = addMoney(
    //         total,
    //         expense.amount
    //     );
    // }

    for (const expense of expenses) {
    
        if (expense.orderNumber) {
            orderExpenses = addMoney(orderExpenses, expense.amount);
        } else {
            businessExpenses = addMoney(businessExpenses, expense.amount);
        }

        total = addMoney(
            orderExpenses,
            businessExpenses
        );
    }

    return {
        orderExpenses,
        businessExpenses,
        total
    };
};



export const calculateRefundTotal = (
    refunds: RefundFinancialData[]
) => {

    let total = decimal(0);

    for (const refund of refunds) {

        total = addMoney(
            total,
            refund.amount
        );
    }

    return total;
};



export const calculateProfit = ({
    revenue,
    refunds,
    expenses,
}: {
    revenue: Prisma.Decimal;
    refunds: Prisma.Decimal;
    expenses: Prisma.Decimal;
}) => {

    const netRevenue = subtractMoney(
        revenue,
        refunds
    );

    const profit = subtractMoney(
        netRevenue,
        expenses
    );

    const profitMargin = netRevenue.isZero()
        ? decimal(0)
        : profit
            .dividedBy(netRevenue)
            .times(100);

    return {
        netRevenue,
        profit,
        profitMargin,
    };
};