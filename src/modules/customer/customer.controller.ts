import type { Request, Response, NextFunction } from "express";
import { createCustomerService, getCustomerService } from "./customer.service.js";
import { sendSuccess } from "@/shared/utils/response.js";
import { HTTP_STATUS } from "@/shared/constants/http-status.js";
import { AppError } from "@/shared/errors/AppError.js";;

export const createCustomer = async (
    req: Request,
    res: Response
) => {

    if(!req.user) {
        throw new AppError("Unauthorized", HTTP_STATUS.UNAUTHORIZED);
    }

    const customer = await createCustomerService(req.body, req.user);

    return sendSuccess(
        res,
        HTTP_STATUS.CREATED,
        "Customer Created Successfully!",
        customer
    );
};


// ================= GET A CUSTOMER ====================

export const getCustomer = async (
    req: Request,
    res: Response
) => {

    const { customerId } = req.params;

    if(typeof customerId !== "string") {
        throw new AppError("Invalid Customer Id", HTTP_STATUS.BAD_REQUEST)
    }

    const customer = await getCustomerService(customerId);

    return sendSuccess(
        res,
        HTTP_STATUS.OK,
        "Customer retrieved successfully!",
        customer
    )
}