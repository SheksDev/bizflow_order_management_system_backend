import type { Request, Response } from "express"
import { getDashboardSummaryService } from "./dashboard.service.js"
import { sendSuccess } from "@/shared/utils/response.js";
import { HTTP_STATUS } from "@/shared/constants/http-status.js";
import { dashboardSummaryQuerySchema } from "./dashboard.validation.js";



export const getDashboardSummary = async (
    req: Request,
    res: Response
) => {

    const query = dashboardSummaryQuerySchema.parse(req.query);

    console.log("QUERY:", query);

    const result = await getDashboardSummaryService(
        query.period,
        query.date,
        query.month,
    );

    return sendSuccess(
        res,
        HTTP_STATUS.OK,
        "Dashboard summary retrieved successfully!",
        result,
    )
}