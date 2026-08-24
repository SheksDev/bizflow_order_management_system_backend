import { PrismaClient, Prisma } from "@prisma/client";
import { CounterName } from "@prisma/client";
import { process } from "zod/v4/core";
import bcrypt from "bcrypt";
import { UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

    console.log("🌱 Starting database seed...");

    const hashedPassword = await bcrypt.hash(
        "Admin@BizFlow123",
        12
    )

    await prisma.counter.createMany({
        data: [
            {
                name: CounterName.USER,
                value: 1,
            },
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
            {
                name: CounterName.CUSTOMER,
                value: 0,
            },
            {
                name: CounterName.ORDER,
                value: 0,
            },
            {
                name: CounterName.ENTRY,
                value: 0,
            },
            {
                name: CounterName.PRODUCT_CATEGORY,
                value: 0,
            },
            {
                name: CounterName.REFUND,
                value: 0,
            },
            {
                name: CounterName.ITEM,
                value: 0,
            },
            {
                name: CounterName.EXPENSE_CATEGORY,
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

    const admin = await prisma.user.upsert({
        where: {
            email: "admin@didundelight.com",
        },

        update: {
            // Don't overwrite the password if the admin already exists
            role: UserRole.ADMIN,
        },

        create: {
            userId: "USER-000001",
            firstName: "Oluwasekemi",
            lastName: "Ariyibi",
            email: "admin@didundelight.com",
            passwordHash: hashedPassword,
            role: UserRole.ADMIN,
        },
    });

    console.log("✅ COUNTER: Counter seeded.");
    console.log("✅ MAIN_CASH: ledger account seeded.");
    console.log("✅ Admin seeded:", admin.email);
}

main()
    .catch((error) => {
        console.error(error);
        // process.exit(1);
    })
    .finally(async () => {await prisma.$disconnect()});