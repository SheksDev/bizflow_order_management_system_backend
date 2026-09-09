import { authorize } from "@/shared/middleware/rbac.middleware.js";
import { validate } from "@/shared/middleware/validate.middleware.js";
import { UserRole } from "@prisma/client";
import { Router } from "express";
import { asyncHandler } from "@/shared/handlers/asyncHandler.js";
import { getPaymentReceipt } from "./receipt.controller.js";
import { getReceiptSchema } from "./receipt.validation.js";



const router = Router();



router.get(
    "/:receiptNumber",
    authorize(UserRole.ADMIN, UserRole.STAFF),
    validate(getReceiptSchema),
    asyncHandler(getPaymentReceipt)
)



export default router;