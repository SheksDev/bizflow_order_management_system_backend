import type { Request, Response, NextFunction } from "express";
import { AppError } from "@/shared/errors/AppError.js";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { prismaErrors } from "@/shared/errors/prisma-errors.js";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";


export const ErrorHandler = (
    err: Error, 
    req: Request, 
    res: Response, 
    next: NextFunction) => {

    if(err instanceof AppError) {

        console.log(err.message);

        return res.status(err.statusCode).json({
            success: false,
            message: err.message
        });

    } 

    if(err instanceof ZodError) {

        console.log(err.message);

        return res.status(400).json({
            success: false,
            message: err.message,
            errors: err.flatten().fieldErrors,
        });
    }

    if (err instanceof PrismaClientKnownRequestError) {

        const prismaError = prismaErrors[err.code as keyof typeof prismaErrors];

        if (prismaError) {
            return res.status(err.code === "P2002" ? 409 : 404).json({
                success: false,
                message: prismaError.message,
            });
        }
    }

    console.error(err);

    const isDevelopment = process.env.NODE_ENV === "development";

    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        ...(isDevelopment && { stack: err.stack})
    });
}