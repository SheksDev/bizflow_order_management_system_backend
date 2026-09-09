import { z } from "zod";



export const getReceiptSchema = z.object({
    params: z.object({
        receiptNumber: z.string().min(1),
    }),
});