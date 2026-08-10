import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const validate =
    (schema: z.ZodObject<any>) =>
        (req: Request, res: Response, next: NextFunction) => {
            
            const result = schema.safeParse({
                body: req.body,
                params: req.params,
                query: req.query,
            });

            if (!result.success) {
            return next(result.error);
            }

            next();
    };