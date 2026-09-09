import { z } from "zod";

export const createPaymentBodySchema = z.object({
    amount: z.coerce
        .number()
        .positive(),

    paymentMethod: z.enum([
        "CASH",
        "BANK_TRANSFER",
        "MOBILE_MONEY",
        "POS",
        "OTHER",
    ]),

    paymentDate: z.coerce.date().optional(),

    reference: z.string().trim().optional(),

    tipAmount: z.coerce
        .number()
        .min(0)
        .default(0),

    notes: z.string().trim().optional(),
});

export const createPaymentSchema = z.object({
    params: z.object({
        orderNumber: z.string().min(1),
    }),

    body: createPaymentBodySchema,
});

export const getPaymentSchema = z.object({
    params: z.object({
        paymentNumber: z.string().min(1),
    }),
});

export type CreatePaymentDTO = z.infer<typeof createPaymentBodySchema>;



export const createRefundBodySchema = z.object({
    amount: z.coerce
        .number()
        .positive(),

    refundMethod: z.enum([
        "CASH",
        "BANK_TRANSFER",
        "MOBILE_MONEY",
        "POS",
        "OTHER",
    ]),

    refundType: z.enum([
        "PAYMENT",
        "TIP"
    ]),

    reason: z.string()
        .trim()
        .min(3)
        .max(500),

    refundDate: z.coerce.date().optional(),

    reference: z.string()
        .trim()
        .optional(),
});

export const createRefundSchema = z.object({
    params: z.object({
        paymentNumber: z.string().min(1),
    }),

    body: createRefundBodySchema,
});

export type CreateRefundDTO = z.infer<typeof createRefundBodySchema>;