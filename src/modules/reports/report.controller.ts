import type { Request, Response } from "express"
import { getProfitReportService, getMonthlyProfitReportService, getCashFlowReportService  } from "./report.service.js"
import { cashFlowReportQuerySchema, profitReportQuerySchema } from "./report.validation.js"
import { sendSuccess } from "@/shared/utils/response.js";
import { HTTP_STATUS } from "@/shared/constants/http-status.js";



export const getProfitReport = async (
    req: Request,
    res: Response
) => {

    const report = await getProfitReportService(profitReportQuerySchema.parse(req.query));

    return sendSuccess(
        res,
        HTTP_STATUS.OK,
        "Profit report summary retrieved successfully!",
        report
    )
}




export const getMonthlyProfitReport = async (
    req: Request,
    res: Response
) => {

    const report = await getMonthlyProfitReportService(profitReportQuerySchema.parse(req.query));

    return sendSuccess(
        res,
        HTTP_STATUS.OK,
        "Profit report summary retrieved successfully!",
        report
    )
}




export const getCashFlowReport = async (
    req: Request,
    res: Response
) => {

    const report = await getCashFlowReportService(cashFlowReportQuerySchema.parse(req.query));

    return sendSuccess(
        res,
        HTTP_STATUS.OK,
        "Profit report summary retrieved successfully!",
        report
    )
}