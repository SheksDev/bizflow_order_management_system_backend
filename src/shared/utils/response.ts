import { Response } from "express";

type PaginationMeta = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
};

export const sendSuccess = <T>(
    res: Response,
    statusCode: number,
    message: string,
    data?: T,
    pagination?: PaginationMeta
) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
        pagination,
    });
};

export const sendError = (
    res: Response,
    statusCode: number,
    message: string,
    errors?: unknown
) => {
    return res.status(statusCode).json({
        success: false,
        message,
        errors,
    });
};