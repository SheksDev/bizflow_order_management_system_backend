import { authorize } from "@/shared/middleware/rbac.middleware.js";
import { validate } from "@/shared/middleware/validate.middleware.js";
import { UserRole } from "@prisma/client";
import { Router } from "express";
import { createExpenseCategorySchema, getExpenseCategorySchema, updateExpenseCategorySchema } from "./expenseCategory.validation.js";
import { asyncHandler } from "@/shared/handlers/asyncHandler.js";
import { createExpenseCategory, deactivateExpenseCategory, getExpenseCategories, getExpenseCategory, updateExpenseCategory } from "./expenseCategory.controller.js";



const router = Router();


router.post(
    "/create",
    authorize(UserRole.ADMIN),
    validate(createExpenseCategorySchema),
    asyncHandler(createExpenseCategory)
)



router.get(
    "/:categoryId",
    authorize(UserRole.ADMIN, UserRole.STAFF),
    validate(getExpenseCategorySchema),
    asyncHandler(getExpenseCategory)
)



router.get(
    "/all",
    authorize(UserRole.ADMIN, UserRole.STAFF),
    asyncHandler(getExpenseCategories)
)


router.patch(
    "/:categoryId",
    authorize(UserRole.ADMIN),
    validate(getExpenseCategorySchema),
    validate(updateExpenseCategorySchema),
    asyncHandler(updateExpenseCategory)
)



router.delete(
    "/:categoryId",
    authorize(UserRole.ADMIN),
    validate(getExpenseCategorySchema),
    asyncHandler(deactivateExpenseCategory)
)

export default router;