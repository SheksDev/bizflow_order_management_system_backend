import { Router } from "express";
import { 
    registerSchema, 
    loginSchema 
} from "./auth.validation.js";
import { 
    refreshAccessToken,
    registerUser,
    userLogin, 
    userLogout
} from "@/modules/auth/auth.controller.js";
import { validate } from "@/shared/middleware/validate.middleware.js";
import { asyncHandler } from "@/shared/handlers/asyncHandler.js";
import { authenticate } from "@/shared/middleware/auth.middleware.js";
import { authorize } from "@/shared/middleware/rbac.middleware.js";
import { UserRole } from "@/generated/prisma/index.js";


const router = Router();

router.post(
    "/register",
    authenticate,
    authorize(UserRole.ADMIN),
    validate(registerSchema),
    asyncHandler(registerUser)
)

router.post(
    "/login",
    validate(loginSchema),
    asyncHandler(userLogin)
)

router.post(
    "/refresh",
    asyncHandler(refreshAccessToken)
)

router.post(
    "/logout",
    authenticate,
    asyncHandler(userLogout)
);


export default router;