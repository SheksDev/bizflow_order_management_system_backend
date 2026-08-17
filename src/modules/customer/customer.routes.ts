import { UserRole } from "@/generated/prisma/index.js";
import { authorize } from "@/shared/middleware/rbac.middleware.js";
import { validate } from "@/shared/middleware/validate.middleware.js";
import { Router } from "express";
import { 
    createCustomerSchema, 
    customerParamsSchema, 
    getCustomersSchema, 
    updateCustomerSchema 
} from "./customer.validation.js";
import { asyncHandler } from "@/shared/handlers/asyncHandler.js";
import { 
    createCustomer, 
    deleteCustomer, 
    getAllCustomers, 
    getCustomer,
    updateCustomer
} from "./customer.controller.js";

const router = Router();

router.post(
    "/create",
    authorize(UserRole.ADMIN, UserRole.STAFF),
    validate(createCustomerSchema),
    asyncHandler(createCustomer)
)

router.get(
    "/all",
    authorize(UserRole.ADMIN, UserRole.STAFF),
    validate(getCustomersSchema),
    asyncHandler(getAllCustomers)
)

router.get(
    "/:customerId",
    authorize(UserRole.ADMIN, UserRole.STAFF),
    validate(customerParamsSchema),
    asyncHandler(getCustomer)
)

router.patch(
    "/:customerId",
    authorize(UserRole.ADMIN, UserRole.STAFF),
    validate(customerParamsSchema),
    validate(updateCustomerSchema),
    asyncHandler(updateCustomer)
)

router.delete(
    "/:customerId",
    authorize(UserRole.ADMIN),
    validate(customerParamsSchema),
    asyncHandler(deleteCustomer)
)


export default router;

