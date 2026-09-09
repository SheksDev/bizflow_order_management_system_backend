import { asyncHandler } from "@/shared/handlers/asyncHandler.js";
import { authorize } from "@/shared/middleware/rbac.middleware.js";
import { UserRole } from "@prisma/client";
import { Router } from "express";
import { getDashboardSummary } from "./dashboard.controller.js";




const router = Router();



router.get(
    "/summary",
    authorize(UserRole.ADMIN),
    asyncHandler(getDashboardSummary)
);



export default router;