import { prisma } from "@/config/prisma.js";
import { CreateCustomerDTO, UpdateCustomerDTO } from "./customer.validation.js";
import { generatePublicId } from "@/shared/utils/generate-public-id.js";
import { CounterName, OrderStatus } from "@prisma/client";
import { JwtUserPayload } from "@/types/express.js";
import { AppError } from "@/shared/errors/AppError.js";
import { HTTP_STATUS } from "@/shared/constants/http-status.js";
import { CustomerQuery } from "./customer.types.js";
import { addMoney, decimal, subtractMoney } from "@/shared/utils/money.js";

// ================= CREATE CUSTOMER ====================

const findCustomer = async (
    customerId: string
) => {

    const customer = await prisma.customer.findUnique({

        where: {
            customerId,
            deletedAt: null
        },

        include: {
            orders: {
                include: {
                    items: true,

                    payments: {
                        include: {
                            refunds: true,
                        }
                    },
                },
            },
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

    const existing =  await prisma.customer.findFirst({

        where: {
            name: data.name,
        },
    });

    if(existing) {
        throw new AppError("Customer Already Exists", HTTP_STATUS.CONFLICT);
    };
    

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

    const customerData = () => {

        let totalOrderValue = decimal(0);
        let totalOutstanding = decimal(0);
        let totalOrderRefunded = decimal(0);

        const orders = customer.orders.map((order) => {

            let totalPaid = decimal(0);
            let totalRefunded = decimal(0);

            for (const payment of order.payments) {

                totalPaid = addMoney(
                    totalPaid,
                    payment.amount
                );

                for (const refund of payment.refunds) {

                    totalRefunded = addMoney(
                        totalRefunded,
                        refund.amount
                    );
                }
            }

            const orderOutstanding = addMoney(
                totalRefunded,
                subtractMoney(
                    order.currentTotal,
                    totalPaid
                )
            );

            if (order.status !== OrderStatus.CANCELLED) {
                totalOrderValue = addMoney(
                    totalOrderValue,
                    order.currentTotal
                );

                if (orderOutstanding.gt(0)) {
                    totalOutstanding = addMoney(
                        totalOutstanding,
                        orderOutstanding
                    );
                }
            }

            totalOrderRefunded = addMoney(totalOrderRefunded, totalRefunded);

            return {
                ...order, 
                totalPaid,
                totalRefunded,
                outstanding: orderOutstanding,
            };
        });

        return {
            ...customer,
            totalOrderValue,
            totalOutstanding,
            totalOrderRefunded,
            orders,
        };
    };

    return customerData();
}



// ================= GET ALL CUSTOMERS SUMMARY ====================

const getCustomerSummary = async () => {

    const [customers, total] = await prisma.$transaction([

        prisma.customer.findMany({

            where: {
                deletedAt: null,
            },

            orderBy: {
                createdAt: "desc",
            },

            include: {
                orders: {
                    include: {
                        payments: {
                            include: {
                                refunds: true,
                            }
                        }
                    }
                },
            }
        }),

        prisma.customer.count({
            where: {
                deletedAt: null,
            }
        }),
    ]);

    let totalOrderValue = decimal(0);
    let totalOutstanding = decimal(0);
    let totalOrderRefunded = decimal(0);
    let totalOrder = 0;

    const completedOrders = customers
        .flatMap(customer => customer.orders)
        .filter(order => order.status === OrderStatus.COMPLETED)
        .length;

    for (const customer of customers) {

        totalOrder += customer.orders.length;
        
        for (const order of customer.orders) {

            let totalRefunded = decimal(0);
            let totalPaid = decimal(0);

            for (const payment of order.payments) {

                totalPaid = addMoney(totalPaid, payment.amount);

                for (const refund of payment.refunds) {

                    totalRefunded = addMoney(totalRefunded, refund.amount);
                }

            } 

            const orderOutstanding = addMoney(totalRefunded, subtractMoney(order.currentTotal, totalPaid));

            if (order.status !== OrderStatus.CANCELLED) {

                totalOrderValue = addMoney(totalOrderValue, order.currentTotal);

                if (orderOutstanding.gt(0)) {
                    totalOutstanding = addMoney(totalOutstanding, orderOutstanding);
                }
            }

            totalOrderRefunded = addMoney(totalOrderRefunded, totalRefunded);
        }
    }

    return {
        totalCustomer: total,
        totalOrder,
        totalOrderValue,
        totalOutstanding,
        totalOrderRefunded,
        completedOrders
    }

}


// ================= GET ALL CUSTOMERS ====================

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
            include: {
                orders: {
                    include: {
                        payments: {
                            include: {
                                refunds: true,
                            }
                        }
                    }
                },
            }
        }),

        prisma.customer.count({
            where: {
                deletedAt: null,
            }
        }),
    ]);

    const customerData = customers.map((customer) => {

        let totalOrderValue = decimal(0);
        let totalOutstanding = decimal(0);
        let totalOrderRefunded = decimal(0);

        for (const order of customer.orders) {

            let totalRefunded = decimal(0);
            let totalPaid = decimal(0);

            for (const payment of order.payments) {

                totalPaid = addMoney(totalPaid, payment.amount);

                for (const refund of payment.refunds) {

                    totalRefunded = addMoney(totalRefunded, refund.amount);
                }

            } 

            const orderOutstanding = addMoney(totalRefunded, subtractMoney(order.currentTotal, totalPaid));

            if (order.status !== OrderStatus.CANCELLED) {

                totalOrderValue = addMoney(totalOrderValue, order.currentTotal);

                if (orderOutstanding.gt(0)) {
                    totalOutstanding = addMoney(totalOutstanding, orderOutstanding);
                }

            }

            totalOrderRefunded = addMoney(totalOrderRefunded, totalRefunded);
        }

        return {
            ...customer,
            totalOrderValue,
            totalOutstanding,
            totalOrderRefunded,
        };
    });

    const totalPages = Math.ceil(total / limit);

    return {
        customers: customerData,
        summary: await getCustomerSummary(),
        pagination: {
            page,
            limit,
            total,
            totalPages
        }
    }
}


// ================= UPDATE A CUSTOMER ====================

export const updateCustomerService = async (
    customerId: string,
    data: UpdateCustomerDTO
) => {

    await findCustomer(customerId);

    return prisma.customer.update({
        where: {customerId},
        data: {
            name: data.name,
            phone: data.phone,
            email: data.email,
            defaultAddress: data.address,
            notes: data.notes,
        },
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