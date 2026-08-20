import { z } from "zod";
import {
    LedgerDirection,
    LedgerEntryType,
} from "@/generated/prisma/index.js";
import type { Request } from "express";

export type ValidatedRequest<
    TBody = unknown,
    TParams = unknown,
    TQuery = unknown
> = Request<
    TParams,
    unknown,
    TBody,
    TQuery
>;




export const getLedgerSchema = z.object({
    query: z.object({
        page: z.coerce.number().int().positive().default(1),

        limit: z.coerce
            .number()
            .int()
            .positive()
            .max(100)
            .default(20),

        type: z
            .enum(LedgerEntryType)
            .optional(),

        direction: z
            .enum(LedgerDirection)
            .optional(),

        orderNumber: z
            .string()
            .optional(),

        startDate: z
            .coerce.date()
            .optional(),

        endDate: z
            .coerce.date()
            .optional(),
    }),
});

export type GetLedgerDTO = z.infer<typeof getLedgerSchema>;


export const ledgerEntryParamsSchema = z.object({
    entryNumber: z.string().min(1),
});

export const getLedgerEntrySchema = z.object({
    params: ledgerEntryParamsSchema,
});