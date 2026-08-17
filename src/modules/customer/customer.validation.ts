import { z } from "zod";

export const createCustomerBodySchema = z.object({

    name: z.string().trim().min(2).max(100),

    phone: z.string().trim().min(7).max(20),

    email: z.email().optional(),

    address: z.string().trim().max(255).optional(),

    notes: z.string().trim().max(1000).optional(),
});

export const createCustomerSchema = z.object({
    body: createCustomerBodySchema,
});

export type CreateCustomerDTO = z.infer<typeof createCustomerBodySchema>;

export const updateCustomerBodySchema = createCustomerBodySchema.partial();

export const updateCustomerSchema = z.object({
    params: z.object({
        customerId: z.string(),
    }),

    body: updateCustomerBodySchema,
});

export type UpdateCustomerDTO =  z.infer<typeof updateCustomerBodySchema>;


export const customerParamsSchema = z.object({
    customerId: z.string().regex(
        /^CUS-\d{6}$/,
        "Invalid customer ID format"
    )
});

export const getCustomersSchema = z.object({
    query: z.object({
        page: z.coerce.number().int().min(1).default(1),
        limit: z.coerce.number().int().min(1).max(100).default(20),
        search: z.string().trim().optional(),
    }),
});