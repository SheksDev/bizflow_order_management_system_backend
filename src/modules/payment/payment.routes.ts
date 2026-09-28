import { authorize } from "@/shared/middleware/rbac.middleware.js";
import { validate } from "@/shared/middleware/validate.middleware.js";
import { UserRole } from "@prisma/client";
import { Router } from "express";
import { createPaymentSchema, createRefundSchema, getPaymentSchema, getPaymentsQuerySchema } from "./payment.validation.js";
import { asyncHandler } from "@/shared/handlers/asyncHandler.js";
import { createPayment, createRefund, getAllPayments, getOrderPayments, getPayment } from "./payment.controller.js";
import { generatePaymentReceipt } from "../receipt/receipt.controller.js";



const router = Router();


router.post(
    "/:orderNumber/payments/create",
    authorize(UserRole.ADMIN, UserRole.STAFF),
    validate(createPaymentSchema),
    asyncHandler(createPayment)
)

router.get(
    "/all",
    authorize(UserRole.ADMIN, UserRole.STAFF),
    validate(getPaymentsQuerySchema),
    asyncHandler(getAllPayments)
)


router.get(
    "/:orderNumber/payments",
    authorize(UserRole.ADMIN, UserRole.STAFF),
    asyncHandler(getOrderPayments)
)


router.post(
    "/:paymentNumber/receipt",
    authorize(UserRole.ADMIN, UserRole.STAFF),
    validate(getPaymentSchema),
    asyncHandler(generatePaymentReceipt)
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