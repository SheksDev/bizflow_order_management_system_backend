import jwt, { type JwtPayload } from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError.js";
import { UserRole } from "@/generated/prisma/index.js";
import { env } from "@/config/env.js";
import { JwtUserPayload } from "@/types/express.js";
import { HTTP_STATUS } from "../constants/http-status.js";


export const authenticate = ( 
    req: Request, 
    res: Response, 
    next: NextFunction 
)  => {

    try {

        const authHeader = req.headers.authorization;

        if(!authHeader?.startsWith("Bearer ")) {
            throw new AppError("Unauthorized", HTTP_STATUS.UNAUTHORIZED);
        }

        const token = authHeader.split(" ")[1];

        if(!token) {
            throw new AppError("Unauthorized", HTTP_STATUS.UNAUTHORIZED);
        }

        const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);

        if (
            typeof decoded === "string" ||
            !decoded.userId ||
            !decoded.role
        ) {
            throw new AppError("Invalid token", HTTP_STATUS.UNAUTHORIZED);
        }

        req.user = decoded as JwtUserPayload;

        next();

    } catch(err: unknown) {

        const message = err instanceof Error 
            ? err.message
            : "Internal Server Error"

        next(new AppError("Invalid or expired token", HTTP_STATUS.UNAUTHORIZED));
    }

}