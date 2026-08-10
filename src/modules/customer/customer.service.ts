import { prisma } from "@/config/prisma.js";
import { CreateCustomerDTO } from "./customer.validation.js";
import { generatePublicId } from "@/shared/utils/generate-public-id.js";
import { CounterName } from "@prisma/client";
import { JwtUserPayload } from "@/types/express.js";
import { AppError } from "@/shared/errors/AppError.js";
import { HTTP_STATUS } from "@/shared/constants/http-status.js";

// ================= CREATE CUSTOMER ====================

const findCustomer = async (
    customerId: string
) => {

    const customer = await prisma.customer.findUnique({

        where: {
            customerId
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
