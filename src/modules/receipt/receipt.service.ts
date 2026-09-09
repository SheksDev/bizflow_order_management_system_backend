import { prisma } from "@/config/prisma.js";
import { AppError } from "@/shared/errors/AppError.js";
import { HTTP_STATUS } from "@/shared/constants/http-status.js";
import { generatePublicId } from "@/shared/utils/generate-public-id.js";
import { CounterName, PaymentStatus } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { addMoney, decimal, maxZero, subtractMoney } from "@/shared/utils/money.js";
import { mapReceiptToResponse, receiptSelect } from "./receipt.mapper.js";



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




export const generatePaymentReceiptService = async (
    paymentNumber: string,
    generatedById: string
) => {

    return prisma.$transaction(async (tx) => {

        const payment = await findPayment(paymentNumber, tx);

        if (payment.status !== PaymentStatus.COMPLETED) {
            throw new AppError("Payment not completed!", HTTP_STATUS.BAD_REQUEST)
        }

        const receipt = await tx.receipt.findUnique({
            where: {
                paymentId: payment.id
            }
        });

        if (receipt) return receipt;

        const sequenceReceipt = await generatePublicId(tx, CounterName.RECEIPT);

        const receiptNumber = `RCPT-${String(sequenceReceipt).padStart(6, "0")}`;

        const generatedReceipt = await tx.receipt.create({

            data: {
                receiptNumber,
                paymentId: payment.id,
                amount: payment.amount,
                tipAmount: payment.tipAmount,
                generatedById,
            }
        });

        return generatedReceipt;
    }, {
        timeout: 15000,
    })
}



export const getPaymentReceiptService = async (
    receiptNumber: string
) => {

    const receipt = await prisma.receipt.findUnique({

        where: {
            receiptNumber,
        },

        select: receiptSelect,
    });

    if (!receipt) throw new AppError("Receipt not found!", HTTP_STATUS.NOT_FOUND);

    return mapReceiptToResponse(receipt);
}