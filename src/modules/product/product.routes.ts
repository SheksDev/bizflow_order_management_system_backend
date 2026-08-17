import { authorize } from "@/shared/middleware/rbac.middleware.js";
import { validate } from "@/shared/middleware/validate.middleware.js";
import { UserRole } from "@prisma/client";
import { Router } from "express";
import { createProductCategorySchema, productCategoryParamsSchema, updateProductCategorySchema } from "./product.validation.js";
import { asyncHandler } from "@/shared/handlers/asyncHandler.js";
import { createProductCategory, deleteProductCategory, getAProductCategory, getProductCategories, updateProductCategory } from "./product.controller.js";


const router = Router();


router.post(
    "/create",
    authorize(UserRole.ADMIN),
    validate(createProductCategorySchema),
    asyncHandler(createProductCategory)
)

router.get(
    "/all",
    authorize(UserRole.ADMIN, UserRole.STAFF),
    asyncHandler(getProductCategories)
)

router.get(
    "/:categoryId",
    authorize(UserRole.ADMIN),
    validate(productCategoryParamsSchema),
    asyncHandler(getAProductCategory)
)

router.patch(
    "/:categoryId",
    authorize(UserRole.ADMIN),
    validate(updateProductCategorySchema),
    asyncHandler(updateProductCategory)
)

router.delete(
    "/:categoryId",
    authorize(UserRole.ADMIN),
    validate(updateProductCategorySchema),
    asyncHandler(deleteProductCategory)
)


export default router;