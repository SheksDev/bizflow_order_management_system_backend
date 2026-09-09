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

type OrderBalanceData = {
    totalAmount: Prisma.Decimal;

    payments: {
        amount: Prisma.Decimal;
        tipAmount: Prisma.Decimal | null;
        refunds: {
            amount: Prisma.Decimal;
        }[];
    }[];
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



export const calculateOrderBalance = ({
    totalAmount,
    payments,
}: OrderBalanceData) => {
    
    let paidAmount = decimal(0);
    let tips = decimal(0);
    let refundedAmount = decimal(0);

    for (const payment of payments) {

        const tip = payment.tipAmount ?? decimal(0);

        const paymentAmount = subtractMoney(
            payment.amount,
            tip
        );

        paidAmount = addMoney(paidAmount, paymentAmount);
        tips = addMoney(tips, tip);

        for (const refund of payment.refunds) {

            refundedAmount = addMoney(
                refundedAmount,
                refund.amount
            );
        }
    }

    const netPaidAmount = subtractMoney(
        paidAmount,
        refundedAmount
    );

    const balanceDifference = subtractMoney(
        totalAmount,
        netPaidAmount
    );

    const outstanding = balanceDifference.isNegative()
        ? decimal(0)
        : balanceDifference;

    const overpaid = balanceDifference.isNegative()
        ? balanceDifference.abs()
        : decimal(0);

    return {
        totalAmount,
        paidAmount,
        refundedAmount,
        netPaidAmount,
        outstanding,
        overpaid,
        tips,
    };
};