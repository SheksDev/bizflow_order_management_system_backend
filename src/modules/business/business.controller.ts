import { HTTP_STATUS } from "@/shared/constants/http-status.js";
import { AppError } from "@/shared/errors/AppError.js";
import type { Request, Response, NextFunction } from "express";
import { sendSuccess } from "@/shared/utils/response.js";
import { getBusinessService, updateBusinessService } from "./business.service.js";



export const getBusiness = async (
    req: Request,
    res: Response
) => {


    const result = await getBusinessService();

    return sendSuccess(
        res,
        HTTP_STATUS.OK,
        "Business retrieved successfully!",
        result
    )
}




export const updateBusiness = async (
    req: Request,
    res: Response
) => {


    const result = await updateBusinessService(req.body);

    return sendSuccess(
        res,
        HTTP_STATUS.OK,
        "Business updated successfully!",
        result
    )
}