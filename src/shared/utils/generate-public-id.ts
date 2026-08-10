import { Prisma } from "@prisma/client";
import { CounterName } from "@prisma/client";

export const generatePublicId = async (
    tx: Prisma.TransactionClient,
    counterName: CounterName
) => {

    const counter = await tx.counter.upsert({
        where: {
            name: counterName
        },
        create: {
            name: counterName,
            value: 1
        },
        update: {
            value: {
                increment: 1
            }
        }
    });

    return counter.value;
};