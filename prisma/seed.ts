import { PrismaClient, Prisma } from "@prisma/client";
import { CounterName } from "@prisma/client";
import { process } from "zod/v4/core";

const prisma = new PrismaClient();

async function main() {
    await prisma.counter.createMany({
        data: [
            {
                name: CounterName.RECEIPT,
                value: 0,
            },
            {
                name: CounterName.PAYMENT,
                value: 0,
            },
            {
                name: CounterName.EXPENSE,
                value: 0,
            },
        ],
        skipDuplicates: true,
    });


    await prisma.ledgerAccount.upsert({
        where: {
            name: "MAIN_CASH",
        },
        update: {},
        create: {
            name: "MAIN_CASH",
            currentBalance: new Prisma.Decimal(0),
        },
    });

    console.log("MAIN_CASH ledger account seeded.");
}

main()
    .catch((error) => {
        console.error(error);
        // process.exit(1);
    })
    .finally(async () => {await prisma.$disconnect()});