import { authorize } from "@/shared/middleware/rbac.middleware.js";
import { validate } from "@/shared/middleware/validate.middleware.js";
import { UserRole } from "@prisma/client";
import { Router } from "express";
import { getLedgerEntrySchema, getLedgerSchema } from "./ledger.validation.js";
import { asyncHandler } from "@/shared/handlers/asyncHandler.js";
import { getLedger, getLedgerBalance, getLedgers } from "./ledger.controller.js";



const router = Router();



router.get(
    "/all",
    authorize(UserRole.ADMIN),
    validate(getLedgerSchema),
    asyncHandler(getLedgers)
)



router.get(
    "/balance",
    authorize(UserRole.ADMIN),
    asyncHandler(getLedgerBalance)
)



router.get(
    "/:entryNumber",
    authorize(UserRole.ADMIN),
    validate(getLedgerEntrySchema),
    asyncHandler(getLedger)
)



export default router;