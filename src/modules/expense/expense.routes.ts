import { authorize } from "@/shared/middleware/rbac.middleware.js";
import { validate } from "@/shared/middleware/validate.middleware.js";
import { UserRole } from "@prisma/client";
import { Router } from "express";
import { asyncHandler } from "@/shared/handlers/asyncHandler.js";
import { createExpenseSchema, expenseSummarySchema, getExpenseSchema, getExpensesQuerySchema, updateExpenseSchema } from "./expense.validation.js";
import { createExpense, deleteExpense, getExpense, getExpenses, getExpenseSummary, updateExpense } from "./expense.controller.js";


const router = Router();


router.post(
    "/create",
    authorize(UserRole.ADMIN, UserRole.STAFF),
    validate(createExpenseSchema),
    asyncHandler(createExpense)
)



router.get(
    "/summary",
    authorize(UserRole.ADMIN, UserRole.STAFF),
    validate(expenseSummarySchema),
    asyncHandler(getExpenseSummary)
)



router.get(
    "/:expenseNumber",
    authorize(UserRole.ADMIN, UserRole.STAFF),
    validate(getExpenseSchema),
    asyncHandler(getExpense)
)



router.get(
    "/all",
    authorize(UserRole.ADMIN, UserRole.STAFF),
    validate(getExpensesQuerySchema),
    asyncHandler(getExpenses)
)



router.patch(
    "/:expenseNumber",
    authorize(UserRole.ADMIN),
    validate(getExpenseSchema),
    validate(updateExpenseSchema),
    asyncHandler(updateExpense)
)



router.delete(
    "/:categoryId",
    authorize(UserRole.ADMIN),
    validate(getExpenseSchema),
    asyncHandler(deleteExpense)
)

export default router;