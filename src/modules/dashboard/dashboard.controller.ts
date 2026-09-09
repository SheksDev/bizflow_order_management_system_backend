import type { Request, Response } from "express"
import { getDashboardSummaryService } from "./dashboard.service.js"
import { sendSuccess } from "@/shared/utils/response.js";
import { HTTP_STATUS } from "@/shared/constants/http-status.js";



export const getDashboardSummary = async (
    req: Request,
    res: Response
) => {

    const result = await getDashboardSummaryService();

    return sendSuccess(
        res,
        HTTP_STATUS.OK,
        "Dashboard summary retrieved successfully!",
        result,
    )
}