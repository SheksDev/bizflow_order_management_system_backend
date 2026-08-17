import { prisma } from "@/config/prisma.js";
import { CreateCustomerDTO, UpdateCustomerDTO } from "./customer.validation.js";
import { generatePublicId } from "@/shared/utils/generate-public-id.js";
import { CounterName } from "@prisma/client";
import { JwtUserPayload } from "@/types/express.js";
import { AppError } from "@/shared/errors/AppError.js";
import { HTTP_STATUS } from "@/shared/constants/http-status.js";
import { CustomerQuery } from "./customer.types.js";

// ================= CREATE CUSTOMER ====================

const findCustomer = async (
    customerId: string
) => {

    const customer = await prisma.customer.findUnique({

        where: {
            customerId,
            deletedAt: null
        }
    });

    if(!customer) {
        throw new AppError("Customer Not Found!", HTTP_STATUS.NOT_FOUND);
    }

    return customer;
}

export const createCustomerService = async (
    data: CreateCustomerDTO,
    user: JwtUserPayload
) => {

    return prisma.$transaction(async (tx) => {

        const sequence = await generatePublicId(tx, CounterName.CUSTOMER)
        
        const customerId = `CUS-${String(sequence).padStart(6, "0")}`;
        

        return tx.customer.create({

            data: {
                customerId,
                name: data.name,
                phone: data.phone,
                email: data.email,
                defaultAddress: data.address,
                notes: data.notes,
                createdBy: {
                    connect:{
                        id: user.id
                    }
                }
            },
        });
    });
};


// ================= GET A CUSTOMER ====================

export const getCustomerService = async (
    customerId: string
) => {

    const customer =  await findCustomer(customerId);

    return customer;
}


// ================= GET ALLCUSTOMERS ====================

export const getAllCustomersService = async (data: CustomerQuery) => {

    const page = Number(data.page) || 1;
    const limit = Number(data.limit) || 10;

    const skip = (page - 1) * limit;

    const [customers, total] = await prisma.$transaction([

        prisma.customer.findMany({

            where: {
                deletedAt: null,
            },
            skip,
            take: limit,
            orderBy: {
                createdAt: "desc",
            },
        }),

        prisma.customer.count({
            where: {
                deletedAt: null,
            }
        }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
        customers,
        pagination: {
            page,
            limit,
            total,
            totalPages
        }
    }
}


// ================= GET ALL CUSTOMERS ====================

export const updateCustomerService = async (
    customerId: string,
    data: UpdateCustomerDTO
) => {

    await findCustomer(customerId);

    return prisma.customer.update({
        where: {customerId},
        data,
    });
}


// ================= DELETE A CUSTOMER ====================

export const deleteCustomerService = async (
    customerId: string
) => {

    await findCustomer(customerId);

    await prisma.customer.update({
        where: { customerId },
        data: {
            deletedAt: new Date(),
        },
    });
};