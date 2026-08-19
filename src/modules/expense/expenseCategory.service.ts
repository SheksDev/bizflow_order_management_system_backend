import { prisma } from "@/config/prisma.js";
import { CreateExpenseCategoryDTO, UpdateExpenseCategoryDTO } from "./expenseCategory.validation.js";
import { AppError } from "@/shared/errors/AppError.js";
import { HTTP_STATUS } from "@/shared/constants/http-status.js";
import { generatePublicId } from "@/shared/utils/generate-public-id.js";
import { CounterName } from "@prisma/client";
import { Prisma } from "@/generated/prisma/client.js";



const findCategory = async (
    categoryId: string,
    tx?: Prisma.TransactionClient
) => {

    const category = await (prisma || tx).expenseCategory.findUnique({

        where: {
            categoryId: categoryId,
            isActive: true
        }
    });

    if(!category) {
        throw new AppError(`Expense Category ${categoryId} Not Found!`, HTTP_STATUS.NOT_FOUND);
    }

    return category;
}




export const createExpenseCategoryService = async (
    data: CreateExpenseCategoryDTO
) => {

    return prisma.$transaction(async (tx) => {

        const existing = await prisma.expenseCategory.findUnique({
            where: {
                name: data.name,
            },
        });

        if (existing) {
            throw new AppError("Expense category already exists", HTTP_STATUS.CONFLICT);
        }

        const sequenceExpense = await generatePublicId(tx, CounterName.EXPENSE_CATEGORY);
        const categoryId = `ECAT-${String(sequenceExpense).padStart(6, "0")}`;

        return tx.expenseCategory.create({

            data: {
                categoryId,
                name: data.name,
                description: data.description,
            },
        })
    })
}



export const getExpenseCategoriesService = async () => {

    return prisma.expenseCategory.findMany({

        where: {
            isActive: true,
        },

        orderBy: {
            name: "asc",
        }
    })
}



export const getExpenseCategoryService = async (
    categoryId: string
) => {

    const category = await findCategory(categoryId);

    return category
}



export const updateExpenseCategoryService = async (
    categoryId: string,
    data: UpdateExpenseCategoryDTO
) => {

    await findCategory(categoryId);

    if (data.name) {
        const duplicate =
            await prisma.expenseCategory.findFirst({
                where: {
                    name: data.name,
                    categoryId: {
                        not: categoryId,
                    },
                },
            });

        if (duplicate) {
            throw new AppError(
                "Expense category already exists",
                HTTP_STATUS.CONFLICT
            );
        }
    }

    return await prisma.expenseCategory.update({

        where: {
            categoryId
        },

        data,
    })
}



export const deactivateExpenseCategoryService = async (
    categoryId: string
) => {

    await findCategory(categoryId);

    return await prisma.expenseCategory.update({

        where: {
            categoryId,
        },

        data: {
            isActive: false,
        }
    })
}