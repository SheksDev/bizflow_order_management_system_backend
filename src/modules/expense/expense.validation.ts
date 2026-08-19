import { z } from "zod";



export const createExpenseBodySchema = z.object({
    orderNumber: z.string().optional(),

    expenseCategoryId: z.string(),

    title: z.string()
        .trim()
        .min(2)
        .max(150),

    amount: z.coerce
        .number()
        .positive(),

    expenseDate: z.coerce
        .date()
        .optional(),

    description: z.string()
        .trim()
        .max(500)
        .optional(),

    receiptUrl: z.string()
        .url()
        .optional(),
});

export const createExpenseSchema = z.object({
    body: createExpenseBodySchema,
});

export type CreateExpenseDTO = z.infer<typeof createExpenseBodySchema>;


export const updateExpenseBodySchema = createExpenseBodySchema.partial();

export const updateExpenseSchema = z.object({
    params: z.object({
        expenseNumber: z.string(),
    }),

    body: updateExpenseBodySchema,
});

export type UpdateExpenseDTO = z.infer<typeof updateExpenseBodySchema>;


export const getExpenseSchema = z.object({
    params: z.object({
        expenseNumber: z.string(),
    }),
});


export const getExpensesQuerySchema = z.object({
    orderNumber: z.string().optional(),

    expenseCategoryId: z.string().optional(),

    startDate: z.coerce.date().optional(),

    endDate: z.coerce.date().optional(),

    page: z.coerce.number().int().positive().default(1),

    limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const getExpensesSchema = z.object({
    query: getExpensesQuerySchema,
});

export type GetExpensesQueryDTO = z.infer<typeof getExpensesQuerySchema>;


export const expenseSummaryQuerySchema = z.object({
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),

    orderNumber: z.string().optional(),

    expenseCategoryId: z.string().optional(),
});

export const expenseSummarySchema = z.object({
    query: expenseSummaryQuerySchema,
});

export type ExpenseSummaryQueryDTO = z.infer<typeof expenseSummaryQuerySchema>;