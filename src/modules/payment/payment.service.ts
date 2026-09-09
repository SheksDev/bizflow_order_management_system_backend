import { prisma } from "@/config/prisma.js";
import { CreatePaymentDTO, CreateRefundDTO } from "./payment.validation.js";
import { findOrder } from "@/shared/constants/findOrder.js";
import { AppError } from "@/shared/errors/AppError.js";
import { HTTP_STATUS } from "@/shared/constants/http-status.js";
import { generatePublicId } from "@/shared/utils/generate-public-id.js";
import { CounterName, LedgerDirection, LedgerEntryType, LedgerReferenceType, PaymentSource, PaymentStatus } from "@prisma/client";
import { USER_SELECT } from "@/shared/constants/prisma-select.js";
import { Prisma } from "@prisma/client";
import { addMoney, decimal, maxZero, subtractMoney } from "@/shared/utils/money.js";
import { createLedgerEntry, findLedgerAccount, generateLedgerNumber } from "../ledgerEntry/ledger.service.js";


const findPayment = async (
    paymentNumber: string,
    tx?: Prisma.TransactionClient
) => {

    const payment = await (prisma || tx).payment.findUnique({
        where: {
            paymentNumber,
        }
    });

    if(!payment) {
        throw new AppError("Payment Not Found!", HTTP_STATUS.NOT_FOUND);
    }

    return payment;
}




export const createPaymentService = async (
    orderNumber: string,
    data: CreatePaymentDTO,
    receivedById: string
) => {

    return prisma.$transaction(async (tx) => {

        const order = await findOrder(orderNumber, tx);

        const paymentAmount = decimal(data.amount);
        const tipAmount = decimal(data.tipAmount) ?? 0;

        const appliedAmount = subtractMoney(paymentAmount, tipAmount);

        const payments = await tx.payment.findMany({
            where: {
                orderNumber: order.orderNumber,
            },
        });

        const totalPaid = payments.reduce(
            (total, payment) => {
                return total + (
                    Number(payment.amount) -
                    Number(payment.tipAmount)
                );
            },
            0
        );

        const orderTotal = decimal(order.currentTotal);
        const outstanding = subtractMoney(orderTotal, totalPaid);

        if (appliedAmount > outstanding) {
            throw new AppError(
                `Payment exceeds outstanding balance by ${subtractMoney(appliedAmount, outstanding)}`,
                HTTP_STATUS.BAD_REQUEST
            );
        };

        const sequencePayment = await generatePublicId(tx, CounterName.PAYMENT);
        const paymentNumber = `PAY-${String(sequencePayment).padStart(6, "0")}`;

        const payment = await tx.payment.create({
            data: {
                paymentNumber,

                orderNumber: order.orderNumber,

                amount: decimal(data.amount),

                tipAmount,

                paymentMethod: data.paymentMethod,

                paymentDate: new Date(`${data.paymentDate}`) ?? new Date(),

                paymentSource: PaymentSource.MANUAL,

                reference: data.reference ?? "",

                notes: data.notes ?? "",

                receivedById,
            },
        });

        const ledgerType = payment.tipAmount.gt(0)
            ? LedgerEntryType.TIP
            : LedgerEntryType.ORDER_PAYMENT;

        // const sequenceLedger = await generatePublicId(tx, CounterName.ENTRY);
        // const entryNumber = `LEDGER-${String(sequenceLedger).padStart(6, "0")}`;

        const entryNumber = await generateLedgerNumber(tx);

        const mainCashAccount = await findLedgerAccount(tx);

        await createLedgerEntry(tx, {

            ledgerAccountId: mainCashAccount.id,

            entryNumber,

            type: ledgerType,

            direction: LedgerDirection.IN,

            amount: decimal(payment.amount),

            description: payment.tipAmount.gt(0)
                ? `Tip received for ${payment.paymentNumber}`
                : `Payment receieved for ${payment.orderNumber}`,

            referenceType: LedgerReferenceType.PAYMENT,

            referenceId: payment.id,

            createdById: receivedById,

            orderNumber: payment.orderNumber,
        })


        return {
            payment,

            summary: {
                orderTotal,
                totalPaid: addMoney(totalPaid, appliedAmount),
                outstanding: maxZero(subtractMoney(outstanding, appliedAmount)),
            },
        }
    }, {
        timeout: 15000,
    })
}



const getPaymentSummaryService = async (
    orderNumber: string
) => {

    const order = await findOrder(orderNumber);

    const payments = await prisma.payment.findMany({

        where: {
            orderNumber,
        },

        include: {
            refunds: true,
        },

        orderBy: {
            paymentDate: "desc",
        },
    });

    let totalReceived = decimal(0);
    let totalTips = decimal(0);
    let totalRefunded = decimal(0);
    let refundedPaymentAmount = decimal(0);
    let refundedTipAmount = decimal(0);

    for (const payment of payments) {

        totalReceived = addMoney(totalReceived, payment.amount);

        totalTips = addMoney(totalTips, payment.tipAmount);

        for (const refund of payment.refunds) {
            if (refund.refundType === "PAYMENT") {
                refundedPaymentAmount =
                    addMoney(refundedPaymentAmount, refund.amount);
            }

            if (refund.refundType === "TIP") {
                refundedTipAmount =
                    addMoney(refundedTipAmount, refund.amount);
            }
        }
    }

    const netReceived = totalReceived.minus(refundedPaymentAmount).minus(refundedTipAmount);

    const totalApplied = totalReceived.minus(totalTips).minus(refundedPaymentAmount);

    totalRefunded = addMoney(refundedPaymentAmount, refundedTipAmount);

    const orderTotal = decimal(order.currentTotal);

    const outstanding =
        maxZero(
            orderTotal.minus(totalApplied)
        );

    const overpayment =
        maxZero(
            totalApplied.minus(orderTotal)
        );

    return {
        orderTotal,
        totalReceived,
        totalRefunded,
        totalTips,
        totalApplied: decimal(totalApplied),
        netReceived: decimal(netReceived),
        outstanding,
        overpayment,
        paymentCount: payments.length,
        lastPayment: payments[0] ?? null,
    }
}



export const getOrderPaymentsService = async (
    orderNumber: string
) => {

    const order = await findOrder(orderNumber);

    const payments = await prisma.payment.findMany({

        where: {
            orderNumber: order.orderNumber
        },

        include: {
            receivedBy: {
                select: USER_SELECT
            },

            refunds: true
        },

        orderBy: {
            paymentDate: "desc",
        },
    });

    const summary = await getPaymentSummaryService(order.orderNumber);

    return {
        payments,
        summary,
    }
}



export const getPaymentService = async (
    paymentNumber: string
) => {

    const payment = await prisma.payment.findUnique({

        where: {
            paymentNumber,
        },

        include: {
            order: {
                select: {
                    orderNumber: true,
                    currentTotal: true,
                    status: true,
                },
            },

            receivedBy: {
                select: USER_SELECT,
            },

            receipt: true,
        },
    });

    if (!payment) {
        throw new AppError("Payment Not Found!", HTTP_STATUS.NOT_FOUND)
    }

    return payment;
}



export const createRefundService = async (
    paymentNumber: string,
    data: CreateRefundDTO,
    processedById: string
) => {

    return prisma.$transaction(async (tx) => {

        const payment = await findPayment(paymentNumber);

        const refunds = await tx.refund.findMany({
            where: {
                paymentNumber: payment.paymentNumber,
            }
        });

        const totalRefunded = refunds.reduce(
            (total, refund) => 
                total + Number(refund.amount),
            0
        );

        const refundableAmount = subtractMoney(payment.amount, totalRefunded);

        if (decimal(data.amount) > refundableAmount) {
            throw new AppError(
                `Refund exceeds refundable amount by ₦${
                subtractMoney(data.amount, refundableAmount)
                }`,
                HTTP_STATUS.BAD_REQUEST
            );
        };

        const sequenceRefund = await generatePublicId(tx, CounterName.REFUND);
        const refundNumber = `REF-${String(sequenceRefund).padStart(6, "0")}`;

        const refund = await tx.refund.create({
            data: {
                refundNumber,

                paymentNumber: payment.paymentNumber,

                amount: decimal(data.amount),

                refundMethod: data.refundMethod,

                refundDate: new Date(`${data.refundDate}`) ?? new Date(),

                reason: data.reason,

                reference: data.reference,

                processedById,
            },
        });

        const entryNumber = await generateLedgerNumber(tx);

        const mainCashAccount = await findLedgerAccount(tx);

        await createLedgerEntry(tx, {

            ledgerAccountId: mainCashAccount.id,

            entryNumber,

            type: LedgerEntryType.REFUND,

            direction: LedgerDirection.OUT,

            amount: decimal(refund.amount),

            description: `Refund for payment ${payment.paymentNumber}`,

            referenceType: LedgerReferenceType.REFUND,

            referenceId: refund.id,

            createdById: processedById,

            orderNumber: payment.orderNumber,
        })

        const newTotalRefunded = addMoney(totalRefunded, data.amount);

        let status: PaymentStatus;

        if (newTotalRefunded === decimal(payment.amount)) {
            status = PaymentStatus.REFUNDED;
        } else {
            status = PaymentStatus.PARTIALLY_REFUNDED;
        }

        await tx.payment.update({
            where: {
                id: payment.id,
            },

            data: {
                status,
            },
        });

        return refund;
    }, {
        timeout: 15000,
    })
}



// export const getPaymentSummaryService = async (
//     orderNumber: string
// ) => {

//     const order = await findOrder(orderNumber);
// }