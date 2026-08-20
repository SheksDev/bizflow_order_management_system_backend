import { authorize } from "@/shared/middleware/rbac.middleware.js";
import { validate } from "@/shared/middleware/validate.middleware.js";
import { UserRole } from "@prisma/client";
import { Router } from "express";
import { profitReportSchema } from "./report.validation.js";
import { asyncHandler } from "@/shared/handlers/asyncHandler.js";
import { getProfitReport } from "./report.controller.js";



const router = Router ();



router.get(
    "/profit",
    authorize(UserRole.ADMIN),
    validate(profitReportSchema),
    asyncHandler(getProfitReport)
)



export default router;