import { z } from "zod";



export const createExpenseCategoryBodySchema = z.object({
    name: z.string().trim().min(2).max(100),

    description: z.string()
        .trim()
        .max(500)
        .optional(),
});

export const createExpenseCategorySchema = z.object({
    body: createExpenseCategoryBodySchema,
});

export type CreateExpenseCategoryDTO = z.infer<typeof createExpenseCategoryBodySchema>;


export const updateExpenseCategoryBodySchema =
    z.object({
        name: z.string().trim().min(2).max(100).optional(),

        description: z.string()
            .trim()
            .max(500)
            .optional(),

        isActive: z.boolean().optional(),
    });

export const updateExpenseCategorySchema = z.object({
    params: z.object({
        categoryId: z.string().min(1),
    }),

    body: updateExpenseCategoryBodySchema,
});

export type UpdateExpenseCategoryDTO = z.infer<typeof updateExpenseCategoryBodySchema>;


export const getExpenseCategorySchema = z.object({
    params: z.object({
        categoryId: z.string().min(1),
    }),
});