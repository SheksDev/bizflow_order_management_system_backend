import { HTTP_STATUS } from "@/shared/constants/http-status.js";
import { AppError } from "@/shared/errors/AppError.js";
import type { Request, Response, NextFunction } from "express";
import { createPaymentService, createRefundService, getAllPaymentsService, getOrderPaymentsService, getPaymentService } from "./payment.service.js";
import { sendSuccess } from "@/shared/utils/response.js";


const validateRequestParams =  (
    req: Request,
) => {

    const { orderNumber, paymentNumber } = req.params;
    
    if(orderNumber !== undefined && typeof orderNumber !== "string") {
        throw new AppError("Invalid Order Number", HTTP_STATUS.BAD_REQUEST)
    }

    if(paymentNumber !== undefined && typeof paymentNumber !== "string") {
        throw new AppError("Invalid Payment Number", HTTP_STATUS.BAD_REQUEST)
    }

    return {
        orderNumber,
        paymentNumber
    };
}



export const createPayment = async (
    req: Request,
    res: Response
) => {

    const { orderNumber } = validateRequestParams(req);

    const result = await createPaymentService(orderNumber, req.body, req.user!.id)

    return sendSuccess(
        res,
        HTTP_STATUS.CREATED,
        "Payment recorded successfully!",
        result
    )
}



export const getAllPayments = async (
    req: Request,
    res: Response
) => {

    const result = await getAllPaymentsService(req.query);

    const { page, limit, total, totalPages } = result.pagination;

    return sendSuccess(
        res, 
        HTTP_STATUS.OK,
        "All payments retrieved successfully!",
        {
            payments: result.payments,
            pagination: {
                page: page,
                limit: limit,
                total: total,
                totalPages: totalPages
            }
        }
    )
}




export const getOrderPayments = async (
    req: Request,
    res: Response
) => {

    const { orderNumber } = validateRequestParams(req);

    const result = await getOrderPaymentsService(orderNumber);

    return sendSuccess(
        res,
        HTTP_STATUS.OK,
        `Order ${orderNumber} payment records retrieved successfully!`,
        result
    )
}



export const getPayment = async (
    req: Request,
    res: Response
) => {

    const { paymentNumber } = validateRequestParams(req);

    const payment = await getPaymentService(paymentNumber);

    return sendSuccess(
        res,
        HTTP_STATUS.OK,
        `Payment ${paymentNumber} retrieved successfully!`,
        payment
    )
}



export const createRefund = async (
    req: Request,
    res: Response
) => {

    const { paymentNumber } = validateRequestParams(req);

    const refund = await createRefundService(paymentNumber, req.body, req.user!.id);

    return sendSuccess(
        res, 
        HTTP_STATUS.CREATED,
        "Refund processed successfully!",
        refund
    )
}