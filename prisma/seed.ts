import { prisma } from "@/config/prisma";
import { CounterName } from "@prisma/client";

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
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());