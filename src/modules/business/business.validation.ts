import { Currency } from "@prisma/client";
import z from "zod";


export const businessBodySchema = z.object({

    businessName: z.string().trim().min(1),

    phone: z.string().trim().min(11).optional().nullable(),

    email: z.email().optional().nullable(),

    address: z.string().trim().min(5).optional().nullable(),

    currency: z.enum(Currency),

    bankName: z.string().trim().optional().nullable(),

    accountName: z.string().trim().optional().nullable(),

    accountNumber: z.string().trim().min(11).optional().nullable(),

    receiptFooter: z.string().trim().optional().nullable(),

    instagram: z.string().trim().min(5).optional().nullable(),

    facebook: z.string().trim().min(5).optional().nullable(),

    whatsapp: z.string().trim().min(5).optional().nullable(),

    logoKey: z.string().trim().min(5).optional().nullable(),
});

// export const orderItemSchema = z.object({
//     body: businessBodySchema,
// });

export const updateBusinessSchema = businessBodySchema.partial();

// export type AddOrderItemDTO = z.infer<typeof businessBodySchema>;
export type UpdateBusinessDTO = z.infer<typeof updateBusinessSchema>;