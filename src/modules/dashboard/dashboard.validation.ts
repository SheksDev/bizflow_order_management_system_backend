import { z } from "zod";

export const dashboardSummaryQuerySchema = z
    .object({

        period: z.enum([
            "current_month",
            "previous_month",
            "custom",
        ]),

        date: z
            .string()
            .date()
            .optional(),

        month: z
            .string()
            .regex(/^\d{4}-\d{2}$/)
            .optional(),
    })
    .superRefine((data, ctx) => {
        
        if (data.period !== "custom") {
            if (data.date || data.month) {
                ctx.addIssue({
                    code: "custom",
                    message:
                        "`date` and `month` can only be used with period=custom",
                    path: ["period"],
                });
            }

            return;
        }

        if (!data.date && !data.month) {
            ctx.addIssue({
                code: "custom",
                message:
                    "Custom period requires either `date` or `month`",
                path: ["period"],
            });
        }

        if (data.date && data.month) {
            ctx.addIssue({
                code: "custom",
                message:
                    "Provide either `date` or `month`, not both",
                path: ["period"],
            });
        }
    });