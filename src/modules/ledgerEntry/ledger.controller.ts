import type { Request, Response } from "express";
import { getLedgerBalanceService, getLedgerService, getLedgersService } from "./ledger.service.js";
import { sendSuccess } from "@/shared/utils/response.js";
import { HTTP_STATUS } from "@/shared/constants/http-status.js";
import { AppError } from "@/shared/errors/AppError.js";
import { GetLedgerDTO } from "./ledger.validation.js";


type LedgerQuery = GetLedgerDTO["query"];


const validateOrderRequestParams =  (
    req: Request,
) => {

    const { entryNumber, itemId } = req.params;
    
    if(typeof entryNumber !== "string") {
        throw new AppError("Invalid Entry Number", HTTP_STATUS.BAD_REQUEST)
    }

    if(itemId !== undefined && typeof itemId !== "string") {
        throw new AppError("Invalid Item Id", HTTP_STATUS.BAD_REQUEST)
    }

    return {
        entryNumber,
        itemId
    };
}



export const getLedgers = async (
    req: Request<
        Record<string, never>,
        unknown,
        unknown,
        LedgerQuery
    >,
    res: Response
) => {

    const result = await getLedgersService(req.query);

    return sendSuccess(
        res,
        HTTP_STATUS.OK,
        "Ledger entries retrieved successfully!",
        result
    )
}



export const getLedger = async (
    req: Request,
    res: Response
) => {

    const { entryNumber } = validateOrderRequestParams(req);

    const entry = await getLedgerService(entryNumber);

    return sendSuccess(
        res,
        HTTP_STATUS.OK,
        `Ledger entry ${entryNumber} retrieved successfully!`,
        entry
    )
}



export const getLedgerBalance = async (
    req: Request, 
    res: Response
) => {

    const balance = await getLedgerBalanceService();

    return sendSuccess(
        res,
        HTTP_STATUS.OK,
        "Ledger balance retrieved successfully!",
        balance
    )
}