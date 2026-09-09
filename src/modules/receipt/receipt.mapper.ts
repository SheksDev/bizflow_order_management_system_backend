import { addMoney } from "@/shared/utils/money.js"
import { Prisma, Receipt } from "@prisma/client"



export const receiptSelect = {

    receiptNumber: true,
    amount: true,
    tipAmount: true,
    receiptDate: true,
    emailedAt: true,

    payment: {
        
        select: {

            paymentNumber: true,
            paymentMethod: true,
            paymentDate: true,

            order: {

                select: {

                    orderNumber: true,
                    deliveryDate: true,
                    
                    customer: {

                        select: {

                            customerId: true,
                            name: true,
                            phone: true,
                            email: true,
                        }
                    },

                    items: {

                        select: {

                            itemId: true,
                            productName: true,
                            quantity: true,
                            unitPrice: true,
                            totalPrice: true,
                            details: true,

                            productCategory: {
                                
                                select: {
                                    name: true,
                                    categoryId: true,
                                    description: true
                                },
                            },
                        },
                    },
                }
            }
        },
    },
} satisfies Prisma.ReceiptSelect;

type ReceiptWithDetails = Prisma.ReceiptGetPayload<{
    select: typeof receiptSelect;
}>;


export const mapReceiptToResponse = (
    receipt: ReceiptWithDetails
) => {

    const totalReceived = addMoney(receipt.amount, receipt.tipAmount);

    return {

        receiptNumber: receipt.receiptNumber,
        receiptDate: receipt.receiptDate,
        emailAt: receipt.emailedAt,

        customer: {
            customerId: receipt.payment.order.customer.customerId,
            name: receipt.payment.order.customer.name,
            phone: receipt.payment.order.customer.phone,
            email: receipt.payment.order.customer.email,
        },

        order: {

            orderNumber: receipt.payment.order.orderNumber,
            deliveryDate: receipt.payment.order.deliveryDate,

            items: receipt.payment.order.items.map((item) => ({

                itemId: item.itemId,
                productName: item.productName,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                totalPrice: item.totalPrice,
                details: item.details,

                productCategory: {
                    categoryId: item.productCategory.categoryId,
                    name: item.productCategory.name,
                    description: item.productCategory.description,
                },
            })),
        },

        payment: {
            paymentNumber: receipt.payment.paymentNumber,
            paymentMethod: receipt.payment.paymentMethod,
            paymentDate: receipt.payment.paymentDate,
        },

        financials: {
            orderPayment: receipt.amount,
            tipReceived: receipt.tipAmount,
            totalReceived,
        },
    }
}