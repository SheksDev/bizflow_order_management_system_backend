import { prisma } from "@/config/prisma.js";
import { CreateProductCategoryDTO, UpdateProductCategoryDTO } from "./product.validation.js";
import { AppError } from "@/shared/errors/AppError.js";
import { HTTP_STATUS } from "@/shared/constants/http-status.js";
import { CounterName } from "@prisma/client";
import { generatePublicId } from "@/shared/utils/generate-public-id.js";


const findCategory = async (
    categoryId: string
) => {

    const category = await prisma.productCategory.findUnique({
        where: {
            categoryId,
        },
    });

    if(!category || category.isActive === false) {
        throw new AppError("Product Category Not Found!", HTTP_STATUS.NOT_FOUND);
    }

    return category;
}


export const createProductCategoryService = async (
    data: CreateProductCategoryDTO
) => {

    return prisma.$transaction(async (tx) => {

        const existingCategory = await tx.productCategory.findUnique({
            where: {
                name: data.name,
            },
        });

        if(existingCategory) {
            throw new AppError("Product Category Already Exists!", HTTP_STATUS.CONFLICT)
        }

        const sequence = await generatePublicId(tx, CounterName.PRODUCT_CATEGORY);
        
        const categoryId = `PROD-${String(sequence).padStart(6, "0")}`;

        return tx.productCategory.create({

            data: {
                categoryId,
                name: data.name,
                description: data.description,
            },
        });
    });
}

export const getProductCategoriesService = async () => {

    return prisma.productCategory.findMany({

        where: {
            isActive: true,
        },

        orderBy: {
            name: "asc",
        },
    });
}

export const getAProductCategoryService = async (
    categoryId: string
) => {

    const category = await findCategory(categoryId);

    return category;
}

export const updateProductCategoryService = async (
    categoryId: string,
    data: UpdateProductCategoryDTO
) => {

    findCategory(categoryId);

    return prisma.productCategory.update({

        where: {
            categoryId,
        },

        data,
    });
}

export const deactivateProductCategoryService = async (
    categoryId: string
) => {

    findCategory(categoryId);

    await prisma.productCategory.update({

        where: { categoryId },

        data: {
            isActive: false,
        }
    })
}