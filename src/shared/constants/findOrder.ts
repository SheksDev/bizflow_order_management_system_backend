import { prisma } from "@/config/prisma.js";
import { Prisma } from "@prisma/client";
import { AppError } from "../errors/AppError.js";
import { HTTP_STATUS } from "@/shared/constants/http-status.js";
import { OrderStatus } from "@prisma/client";


export const findOrder = async (
    orderNumber: string,
    tx?: Prisma.TransactionClient
) => {

    const order = await (prisma || tx).order.findUnique({

        where: {
            orderNumber,
            deletedAt: null,
        },

        include: {
            
            customer: true,

            items: {
                orderBy: {
                    createdAt: "asc"
                },
            },

            payments: true,
            expenses: true,
        },
    });

    if(!order) {
        throw new AppError(`Order ${orderNumber} Not Found!`, HTTP_STATUS.NOT_FOUND);
    }

    if (order.status === OrderStatus.CANCELLED) {
        throw new AppError("Cancelled orders cannot be edited", HTTP_STATUS.BAD_REQUEST);
    }

    return order;
}