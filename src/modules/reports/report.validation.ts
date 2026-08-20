import { z } from "zod";



export const profitReportQuerySchema = z.object({
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
});

export const profitReportSchema = z.object({
    query: profitReportQuerySchema,
});

export type ProfitReportQueryDTO = z.infer<typeof profitReportQuerySchema>;