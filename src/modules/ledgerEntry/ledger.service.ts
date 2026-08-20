import { prisma } from "@/config/prisma.js";
import { HTTP_STATUS } from "@/shared/constants/http-status.js";
import { AppError } from "@/shared/errors/AppError.js";
import { generatePublicId } from "@/shared/utils/generate-public-id.js";
import { addMoney, decimal, subtractMoney } from "@/shared/utils/money.js";
import { CounterName, LedgerDirection, LedgerEntryType, LedgerReferenceType, Prisma } from "@prisma/client";
import { GetLedgerDTO } from "./ledger.validation.js";
import { USER_SELECT } from "@/shared/constants/prisma-select.js";


export interface CreateLedgerEntryInput {
    entryNumber: string, 

    direction: LedgerDirection;
    type: LedgerEntryType;
    amount: Prisma.Decimal.Value;

    referenceType: LedgerReferenceType;
    referenceId: string;

    ledgerAccountId: string,

    description?: string;

    createdById: string;

    orderNumber?: string | null;
}



export const findLedgerAccount = async (
    tx?: Prisma.TransactionClient
) => {

    const mainCashAccount = await (tx || prisma).ledgerAccount.findUnique({
        where: {
            name: "MAIN_CASH",
        },
    });

    if (!mainCashAccount) {
        throw new AppError(
            "Main cash ledger account not configured.",
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }

    return mainCashAccount;
}

export const findAccount = async (
    tx: Prisma.TransactionClient,
    ledgerAccountId: string
) => {

    const account =await tx.ledgerAccount.findUnique({
        where: {
            id: ledgerAccountId,
        },

        select: {
            id: true,
            name: true,
            currentBalance: true,
        }
    });

    if (!account) {
        throw new AppError("Ledger account not found", HTTP_STATUS.NOT_FOUND);
    }

    return account;
}


export const createLedgerEntry = async (
    tx: Prisma.TransactionClient,
    data: CreateLedgerEntryInput
) => {

    await tx.$queryRaw`
        SELECT id
        FROM "LedgerAccount"
        WHERE id = ${data.ledgerAccountId}
        FOR UPDATE
    `;

    const account = await findAccount(tx, data.ledgerAccountId);

    if (!account) {
        throw new AppError("Ledger account not found", HTTP_STATUS.NOT_FOUND);
    }

    // const lastEntry = await tx.ledgerEntry.findFirst({
    //     orderBy: [
    //         {
    //             createdAt: "desc",
    //         },
    //         {
    //             id: "desc",
    //         }
    //     ],

    //     select: {
    //         balanceAfter: true,
    //     },
    // });

    // const currentBalance = lastEntry?.balanceAfter ?? decimal(0);

    const balanceAfter = data.direction === LedgerDirection.IN
        ? addMoney(account.currentBalance, data.amount)
        : subtractMoney(account.currentBalance, data.amount);

    await tx.ledgerAccount.update({
        where: {
            id: data.ledgerAccountId,
        },

        data: {
            currentBalance: balanceAfter,
        },
    });

    return tx.ledgerEntry.create({

        data: {
            entryNumber: data.entryNumber,

            type: data.type,

            direction: data.direction,

            amount: decimal(data.amount),

            balanceAfter,

            description: data.description,

            referenceType: data.referenceType,

            referenceId: data.referenceId,

            createdById: data.createdById,

            orderNumber: data.orderNumber,

            ledgerAccountId: data.ledgerAccountId,

        }
    })
}



export const generateLedgerNumber = async (
    tx: Prisma.TransactionClient,
) => {

    const sequenceLedger = await generatePublicId(tx, CounterName.ENTRY);
    const entryNumber = `LEDGER-${String(sequenceLedger).padStart(6, "0")}`;

    return entryNumber;
}



// await prisma.$transaction(async (tx) => {

//     const sequenceLedger = await generatePublicId(tx, CounterName.ENTRY);
//     const entryNumber = `ENTRY-${String(sequenceLedger).padStart(6, "0")}`;

//     return createLedgerEntry(tx, {

//         entryNumber,

//         type: LedgerEntryType.OPENING_BALANCE,

//         direction: LedgerDirection.IN,

//         amount: new Prisma.Decimal(0),

//         description: "Opening business cash balance",

//         referenceType: LedgerReferenceType.OPENING_BALANCE,

//         referenceId: "OPENING-2026",

//         createdById: userId,
//     });
// });



export const getLedgersService = async (
    data: GetLedgerDTO["query"]
) => {

    const skip = (data.page - 1) * data.limit;

    const where: Prisma.LedgerEntryWhereInput = {};

    if (data.type) {
        where.type = data.type;
    }

    if (data.direction) {
        where.direction = data.direction;
    }

    if (data.orderNumber) {
        where.orderNumber = data.orderNumber;
    }

    if (data.startDate || data.endDate) {

        where.createdAt = {};

        if (data.startDate) {
            where.createdAt.gte = data.startDate;
        }

        if (data.endDate) {

            const endDate = new Date(data.endDate);

            endDate.setDate(
                endDate.getDate() + 1
            );

            where.createdAt.lt = endDate;
        }
    }

    const [entries, total] = await Promise.all([
        prisma.ledgerEntry.findMany({

            where,

            skip,

            take: data.limit,

            orderBy: {
                createdAt: "desc",
            },

            include: {
                order: {
                    select: {
                        id: true,
                        orderNumber: true,
                    },
                },
            },
        }),

        prisma.ledgerEntry.count({
            where,
        }),
    ]);

    return {
        entries,

        pagination: {
            page: data.page,

            limit: data.limit,

            total,

            totalPages: Math.ceil(total / data.limit),
        },
    };
}



export const getLedgerService = async (
    entryNumber: string
) => {

    const entry = await prisma.ledgerEntry.findUnique({

        where: { entryNumber },

        include: {
            order: {
                select: {
                    id: true,
                    orderNumber: true,
                },
            },

            createdBy: {
                select: USER_SELECT
            },

            ledgerAccount: {
                select: {
                    id: true,
                    name: true,
                    currentBalance: true,
                },
            },
        },
    });

    if(!entry) {
        throw new AppError("Ledger Entry Not Found!", HTTP_STATUS.NOT_FOUND)
    };

    return entry;
}



export const getLedgerBalanceService = async () => {

    const account = await findLedgerAccount();

    return account;
}