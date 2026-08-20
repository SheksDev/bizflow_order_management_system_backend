import { authorize } from "@/shared/middleware/rbac.middleware.js";
import { validate } from "@/shared/middleware/validate.middleware.js";
import { UserRole } from "@prisma/client";
import { Router } from "express";
import { cashFlowReportSchema, profitReportSchema } from "./report.validation.js";
import { asyncHandler } from "@/shared/handlers/asyncHandler.js";
import { getCashFlowReport, getMonthlyProfitReport, getProfitReport } from "./report.controller.js";
import { expenseSummarySchema } from "../expense/expense.validation.js";
import { getExpenseSummary, getMonthlyExpenseReport } from "../expense/expense.controller.js";



const router = Router ();



router.get(
    "/profit",
    authorize(UserRole.ADMIN),
    validate(profitReportSchema),
    asyncHandler(getProfitReport)
)



router.get(
    "/profit/monthly",
    authorize(UserRole.ADMIN),
    validate(profitReportSchema),
    asyncHandler(getMonthlyProfitReport)
)



router.get(
    "/expenses",
    authorize(UserRole.ADMIN, UserRole.STAFF),
    validate(expenseSummarySchema),
    asyncHandler(getExpenseSummary)
)




router.get(
    "/expenses/monthly",
    authorize(UserRole.ADMIN),
    validate(expenseSummarySchema),
    asyncHandler(getMonthlyExpenseReport)
)



router.get(
    "cash-flow",
    authorize(UserRole.ADMIN),
    validate(cashFlowReportSchema),
    asyncHandler(getCashFlowReport)
)



export default router;