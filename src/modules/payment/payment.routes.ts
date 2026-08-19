import { authorize } from "@/shared/middleware/rbac.middleware.js";
import { validate } from "@/shared/middleware/validate.middleware.js";
import { UserRole } from "@prisma/client";
import { Router } from "express";
import { createPaymentSchema, createRefundSchema, getPaymentSchema } from "./payment.validation.js";
import { asyncHandler } from "@/shared/handlers/asyncHandler.js";
import { createPayment, createRefund, getOrderPayments, getPayment } from "./payment.controller.js";



const router = Router();


router.post(
    "/:orderNumber/payments/create",
    authorize(UserRole.ADMIN, UserRole.STAFF),
    validate(createPaymentSchema),
    asyncHandler(createPayment)
)


router.get(
    "/:orderNumber/payments",
    authorize(UserRole.ADMIN, UserRole.STAFF),
    asyncHandler(getOrderPayments)
)


router.get(
    "/:paymentNumber",
    authorize(UserRole.ADMIN, UserRole.STAFF),
    validate(getPaymentSchema),
    asyncHandler(getPayment)
)


router.post(
    "/:paymentNumber/refunds/create",
    authorize(UserRole.ADMIN),
    validate(createRefundSchema),
    asyncHandler(createRefund)
)




export default router;