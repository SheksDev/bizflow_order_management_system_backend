import { UserRole } from "@/generated/prisma/index.js";
import { authorize } from "@/shared/middleware/rbac.middleware.js";
import { validate } from "@/shared/middleware/validate.middleware.js";
import { Router } from "express";
import { createCustomerSchema, updateCustomerSchema } from "./customer.validation.js";
import { asyncHandler } from "@/shared/handlers/asyncHandler.js";
import { 
    createCustomer, 
    getCustomer
} from "./customer.controller.js";

const router = Router();

router.post(
    "/create",
    authorize(UserRole.ADMIN, UserRole.STAFF),
    validate(createCustomerSchema),
    asyncHandler(createCustomer)
)

router.get(
    "/:customerId",
    authorize(UserRole.ADMIN, UserRole.STAFF),
    asyncHandler(getCustomer)
)


export default router;

