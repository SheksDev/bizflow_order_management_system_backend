import { prisma } from "@/config/prisma.js"
import { HTTP_STATUS } from "@/shared/constants/http-status.js";
import { AppError } from "@/shared/errors/AppError.js";
import { UpdateBusinessDTO } from "./business.validation.js";




export const getBusinessService = async () => {

    const business = await prisma.business.findFirst();

    if (!business) throw new AppError("Business Configuration not found!", HTTP_STATUS.NOT_FOUND);

    return business;
}



export const updateBusinessService = async (
    data: UpdateBusinessDTO
) => {

    const business = await prisma.business.findFirst();

    if (!business) throw new AppError("Business Configuration not found!", HTTP_STATUS.NOT_FOUND)

    return prisma.business.update({

        where: {
            id: business.id,
        },

        data,
    })
}