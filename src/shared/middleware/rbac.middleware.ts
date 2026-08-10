import type { Request, Response, NextFunction } from "express";
import { UserRole } from "@/generated/prisma/index.js";
import { AppError } from "@/shared/errors/AppError.js";
import { HTTP_STATUS } from "../constants/http-status.js";

export const authorize = (...allowedRoles: UserRole[]) => {
    return (
        req: Request,
        res: Response,
        next: NextFunction
) => {
        if (!req.user) {
            return next(
                new AppError("Unauthorized", HTTP_STATUS.UNAUTHORIZED)
            );
        }

        if (!allowedRoles.includes(req.user.role)) {
            return next(
                new AppError("Forbidden", HTTP_STATUS.FORBIDDEN)
            );
        }

        next();
    };
};