import { z } from "zod";

export const createProductCategoryBodySchema = z.object({
    name: z.string().trim().min(2).max(100),
    description: z.string().trim().max(500).optional(),
});

export const createProductCategorySchema = z.object({
    body: createProductCategoryBodySchema,
});

export const updateProductCategoryBodySchema = createProductCategoryBodySchema.partial();

export const updateProductCategorySchema = z.object({
    params: z.object({
        categoryId: z.string(),
    }),

    body: updateProductCategoryBodySchema,
});

export const productCategoryParamsSchema = z.object({
    params: z.object({
        categoryId: z.string(),
    }),
});

export type CreateProductCategoryDTO = z.infer<typeof createProductCategoryBodySchema>;

export type UpdateProductCategoryDTO = z.infer<typeof updateProductCategoryBodySchema>;