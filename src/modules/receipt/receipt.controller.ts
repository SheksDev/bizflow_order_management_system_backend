import { HTTP_STATUS } from "@/shared/constants/http-status.js";
import { AppError } from "@/shared/errors/AppError.js";
import type { Request, Response, NextFunction } from "express";
import { sendSuccess } from "@/shared/utils/response.js";
import { generatePaymentReceiptService, getPaymentReceiptService } from "./receipt.service.js";


const validateRequestParams =  (
    req: Request,
) => {

    const { receiptNumber, paymentNumber } = req.params;
    
    if(receiptNumber !== undefined && typeof receiptNumber !== "string") {
        throw new AppError("Invalid Receipt Number", HTTP_STATUS.BAD_REQUEST)
    }

    if(paymentNumber !== undefined && typeof paymentNumber !== "string") {
        throw new AppError("Invalid Payment Number", HTTP_STATUS.BAD_REQUEST)
    }

    return {
        receiptNumber,
        paymentNumber
    };
}




export const generatePaymentReceipt = async (
    req: Request,
    res: Response
) => {

    const { paymentNumber } = validateRequestParams(req);

    const result = await generatePaymentReceiptService(paymentNumber, req.user!.id);

    return sendSuccess(
        res,
        HTTP_STATUS.CREATED,
        "Receipt retrieved successfully!",
        result
    )
}




export const getPaymentReceipt = async (
    req: Request,
    res: Response
) => {

    const { receiptNumber } = validateRequestParams(req);

    const result = await getPaymentReceiptService(receiptNumber);

    return sendSuccess(
        res,
        HTTP_STATUS.OK,
        "Receipt retrieved successfully!",
        result
    )
}