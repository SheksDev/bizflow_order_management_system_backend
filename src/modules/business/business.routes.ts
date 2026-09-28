import { authorize } from "@/shared/middleware/rbac.middleware.js";
import { validate } from "@/shared/middleware/validate.middleware.js";
import { UserRole } from "@prisma/client";
import { Router } from "express";
import { asyncHandler } from "@/shared/handlers/asyncHandler.js";
import { getBusiness, updateBusiness } from "./business.controller.js";
import { businessBodySchema, updateBusinessSchema } from "./business.validation.js";



const router = Router();


router.get(
    "/",
    authorize(UserRole.ADMIN, UserRole.STAFF),
    asyncHandler(getBusiness)
)



router.patch(
    "/",
    authorize(UserRole.ADMIN),
    validate(updateBusinessSchema),
    asyncHandler(updateBusiness)
)



export default router