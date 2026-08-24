import { prisma } from "@/config/prisma.js";
import { AppError } from "@/shared/errors/AppError.js";
import { HTTP_STATUS } from "@/shared/constants/http-status.js";
import { AddOrderItemDTO, CreateOrderDTO, UpdateOrderDTO, UpdateOrderItemDTO } from "./order.validation.js";
import { generatePublicId } from "@/shared/utils/generate-public-id.js";
import { CounterName, OrderItemStatus, OrderStatus } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { OrderQuery } from "./order.types.js";
import { canTransitionOrderStatus } from "./order.constants.js";
import { findOrder } from "@/shared/constants/findOrder.js";
import { addMoney, decimal, multiplyMoney, subtractMoney } from "@/shared/utils/money.js";

// ================= CREATE ORDER ====================

const findCustomer = async (
    customerId: string,
    tx?: Prisma.TransactionClient
) => {

    const customer = await (tx || prisma).customer.findUnique({

        where: {
            customerId: customerId,
            deletedAt: null
        }
    });

    if(!customer) {
        throw new AppError("Customer Not Found!", HTTP_STATUS.NOT_FOUND);
    }

    return customer;
}

const findCategory = async (
    categoryId: string,
    tx?: Prisma.TransactionClient
) => {

    const category = await (tx || prisma).productCategory.findUnique({

        where: {
            categoryId: categoryId,
            isActive: true
        }
    });

    if(!category) {
        throw new AppError(`Product Category ${categoryId} Not Found!`, HTTP_STATUS.NOT_FOUND);
    }

    return category;
}

// const findOrder = async (
//     orderNumber: string,
//     tx?: Prisma.TransactionClient
// ) => {

//     const order = await (prisma || tx).order.findUnique({

//         where: {
//             orderNumber,
//             deletedAt: null,
//         },

//         include: {
            
//             customer: true,

//             items: {
//                 orderBy: {
//                     createdAt: "asc"
//                 },
//             },

//             payments: true,
//             expenses: true,
//         },
//     });

//     if(!order) {
//         throw new AppError(`Order ${orderNumber} Not Found!`, HTTP_STATUS.NOT_FOUND);
//     }

//     if (order.status === OrderStatus.CANCELLED) {
//         throw new AppError("Cancelled orders cannot be edited", HTTP_STATUS.BAD_REQUEST);
//     }

//     return order;
// }

const findItem = async (
    itemId: string,
    orderNumber: string,
    tx?: Prisma.TransactionClient
) => {

    const item = await (prisma || tx).orderItem.findUnique({

        where: {
            itemId: itemId,

            order: {
                orderNumber,
                deletedAt: null,
            },
        },

        include: {
            order: true
        }
    })

    if (!item) {
        throw new AppError("Order Item Not Found!", HTTP_STATUS.NOT_FOUND);
    }

    if (item.status === OrderItemStatus.CANCELLED) {
        throw new AppError("Order item is already cancelled", HTTP_STATUS.BAD_REQUEST);
    }

    return item;
}



export const createOrderService = async (
    data: CreateOrderDTO,
    userId: string
) => {

    // let calculatedItems = data.items.map((item) => {

    //     const totalPrice =
    //         item.quantity * item.unitPrice;

    //     return {
    //         ...item,
    //         totalPrice,
    //     };
    // });

    return prisma.$transaction(async (tx) => {

        const customer = await findCustomer(data.customerId, tx);

        // console.log(customer);

        const calculatedItems = [];

        for (const item of data.items) {

            await findCategory(item.categoryId, tx);

            // const totalPrice = item.quantity * Prisma.Decimal(item.unitPrice);
            const totalPrice = multiplyMoney(item.quantity, item.unitPrice);

            calculatedItems.push({
                ...item,
                totalPrice
            });
        }

        const totalAmount =
            calculatedItems.reduce(
                (sum, item) => addMoney(sum, item.totalPrice),
                new Prisma.Decimal(0)
        );

        const sequenceOrder = await generatePublicId(tx, CounterName.ORDER)
        const sequenceItem = await generatePublicId(tx, CounterName.ITEM)
                
        const orderNumber = `ORD-${String(sequenceOrder).padStart(6, "0")}`;
        const itemId = `ITEM-${String(sequenceItem).padStart(6, "0")}`;

        const order = await tx.order.create({

            data: {

                orderNumber,

                customerId: customer.customerId,

                deliveryDate: data.deliveryDate,
                deliveryAddress: data.deliveryAddress,
                deliveryMethod: data.deliveryMethod,

                status: OrderStatus.PENDING,

                originalTotal: totalAmount,
                currentTotal: totalAmount,

                notes: data.notes ?? "",

                createdById: userId,

                items: {
                    create: calculatedItems.map((item) => ({

                        itemId: itemId,
                        productCategory: {
                            connect: {
                                categoryId: item.categoryId,
                            }
                        },
                        productName: item.productName,
                        quantity: item.quantity,
                        unitPrice: decimal(item.unitPrice),
                        totalPrice: decimal(item.totalPrice),
                        details: item.details as Prisma.InputJsonValue,
                    })),
                },
            },

            include: {
                items: true,
                customer: true,
            },
        });

        return order;
    })
}



export const getAllOrdersService = async (
    data: OrderQuery
) => {

    const page = Number(data.page) || 1;
    const limit = Number(data.limit) || 20;

    const skip = (page - 1 ) * limit;

    const [orders, total] = await prisma.$transaction([
        
        prisma.order.findMany({

            where: {
                deletedAt: null,
            },

            skip,
            take: limit,

            orderBy: {
                createdAt: "desc",
            },

            include: {

                customer: true,

                items: {
                    where: {
                        status: {
                            in: [
                                OrderItemStatus.CONFIRMED,
                                OrderItemStatus.DELIVERED,
                                OrderItemStatus.PENDING,
                                OrderItemStatus.PREPARING,
                                OrderItemStatus.READY,
                            ],
                        },
                    },

                    orderBy: {
                        createdAt: "asc",
                    },
                },

                payments: true,
                expenses: true,
            },
        }),

        prisma.order.count({
            where: {
                deletedAt: null,
            }
        }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
        orders,
        pagination: {
            page,
            limit,
            total,
            totalPages
        }
    }
}



export const getOrderService = async (
    orderNumber: string
) => {

    const order = await findOrder(orderNumber);

    return order;
}



export const updateOrderService = async (
    orderNumber: string,
    data: UpdateOrderDTO
) => {

    await findOrder(orderNumber);

    return prisma.order.update({

        where: {
            orderNumber,
        },

        data,
    })
}



export const updateOrderTotalService = async (
    orderNumber: string,
    total: number
) => {

    await findOrder(orderNumber);

    return prisma.order.update({

        where: {
            orderNumber,
        },

        data: {
            originalTotal: decimal(total),
            currentTotal: decimal(total),
        }
    })
}



export const addOrderItemService = async (
    orderNumber: string,
    // categoryId: string,
    data: AddOrderItemDTO
) => {

    return prisma.$transaction(async (tx) => {

        const order = await findOrder(orderNumber, tx);

        const category = await findCategory(data.categoryId, tx);

        const totalPrice = multiplyMoney(data.quantity, data.unitPrice);

        const sequenceItem = await generatePublicId(tx, CounterName.ITEM)
                
        const itemId = `ITEM-${String(sequenceItem).padStart(6, "0")}`;

        const item = await tx.orderItem.create({

            data: {
                orderNumber: order.orderNumber,
                itemId,
                productCategoryId: category.categoryId,
                productName: data.productName,
                quantity: data.quantity,
                unitPrice: decimal(data.unitPrice),
                totalPrice,
                details: data.details as Prisma.InputJsonValue
            },
        });

        await tx.order.update({

            where: {
                id: order.id,
            },

            data: {
                currentTotal: {
                    increment: totalPrice,
                }
            }
        });

        return item;
    })
}



export const updateOrderItemService = async (
    orderNumber: string,
    itemId: string,
    data: UpdateOrderItemDTO
) => {

    return await prisma.$transaction(async (tx) => {

        const item = await findItem(itemId, orderNumber, tx);

        const order = await findOrder(orderNumber, tx);

        let categoryId = item.productCategoryId;

        if(data.categoryId) {

            const category = await findCategory(categoryId, tx);

            categoryId = category.categoryId;
        }

        const newQuantity = data.quantity ?? item.quantity;
        const newUnitPrice = data.unitPrice !== undefined
            ? decimal(data.unitPrice)
            : item.unitPrice

        // const newTotal = new Prisma.Decimal(newQuantity).mul(newUnitPrice);
        const newTotal = multiplyMoney(newQuantity, newUnitPrice);

        // const difference = newTotal.minus(item.totalPrice);
        const difference = subtractMoney(newTotal, item.totalPrice)

        const updatedItem = await tx.orderItem.update({
            where: {
                id: item.id
            },

            data: {
                quantity: newQuantity,
                unitPrice: newUnitPrice,
                totalPrice: newTotal,

                productCategoryId: categoryId,

                ...(data.productName !== undefined && {
                    productName: data.productName,
                }),

                ...(data.details !== undefined && {
                    details: data.details as Prisma.InputJsonValue,
                }),
            }
        })

        await tx.order.update({

            where: {
                id: order.id,
            },

            data: {
                currentTotal: {
                    increment: difference,
                }
            }
        })

        return updatedItem;
    })
}



export const updateOrderStatusService = async (
    orderNumber: string,
    nextStatus: OrderStatus
) => {

    const order = await findOrder(orderNumber);

    if (
        !canTransitionOrderStatus(
            order.status,
            nextStatus
        )
    ) {
        throw new AppError(
            `Cannot change order status from ${order.status} to ${nextStatus}`,
            HTTP_STATUS.BAD_REQUEST
        );
    }

    return prisma.order.update({
        where: {
            orderNumber,
        },

        data: {
            status: nextStatus,
        },
    });
};



export const cancelOrderItemService = async (
    orderNumber: string,
    itemId: string
) => {

    return prisma.$transaction(async (tx) => {

        const item = await findItem(itemId, orderNumber, tx)

        const updatedItem = await tx.orderItem.update({

            where: {
                id: item.id,
            },

            data: {
                status: OrderItemStatus.CANCELLED,
            },
        });

        await tx.order.update({

            where: {
                id: item.order.id,
            },

            data: {
                currentTotal: {
                    decrement: item.totalPrice
                },
            },
        });

        return updatedItem;
    });
}



export const cancelOrderService = async (
    orderNumber: string,
    reason: string
) => {

    return prisma.$transaction(async (tx) => {

        const order = await findOrder(orderNumber, tx);

        if (
            order.status === "COMPLETED" ||
            order.status === "DELIVERED"
        ) {
            throw new AppError(
                "This order cannot be cancelled",
                HTTP_STATUS.BAD_REQUEST
            );
        }

        if (order.status === "CANCELLED") {
            throw new AppError(
                "Order is already cancelled",
                HTTP_STATUS.BAD_REQUEST
            );
        }

        return tx.order.update({
            where: {
                id: order.id,
            },

            data: {
                status: OrderStatus.CANCELLED,
                cancelledAt: new Date(),
                cancelReason: reason,
            },
        });
    });
};



export const deleteOrderService = async (
    orderNumber: string
) => {

    const order = await findOrder(orderNumber);

    await prisma.order.update({
        where: {
            id: order.id,
        },

        data: {
            deletedAt: new Date(),
        },
    });
};