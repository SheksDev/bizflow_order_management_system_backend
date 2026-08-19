import { HTTP_STATUS } from "@/shared/constants/http-status.js";
import { AppError } from "@/shared/errors/AppError.js";
import type { Request, Response } from "express";
import { createExpenseService, deleteExpenseService, getExpenseService, getExpensesService, getExpenseSummaryService, updateExpenseService } from "./expense.service.js";
import { sendSuccess } from "@/shared/utils/response.js";
import { expenseSummaryQuerySchema, getExpensesQuerySchema } from "./expense.validation.js";


const validateRequestParams =  (
    req: Request,
) => {

    const { expenseNumber, categoryId } = req.params;
    
    if(expenseNumber !== undefined && typeof expenseNumber !== "string") {
        throw new AppError("Invalid Order Number", HTTP_STATUS.BAD_REQUEST)
    }

    if(categoryId !== undefined && typeof categoryId !== "string") {
        throw new AppError("Invalid Payment Number", HTTP_STATUS.BAD_REQUEST)
    }

    return {
        expenseNumber,
        categoryId
    };
}




export const createExpense = async (
    req: Request, 
    res: Response
) => {

    const expense = await createExpenseService(req.body, req.user!.id)

    return sendSuccess(
        res,
        HTTP_STATUS.CREATED,
        "Expense recorded successfully",
        expense
    )
}



export const getExpenses = async (
    req: Request, 
    res: Response
) => {

    const result = await getExpensesService(getExpensesQuerySchema.parse(req.query));

    return sendSuccess(
        res,
        HTTP_STATUS.OK,
        "Expenses retrieved successfully!",
        result
    )
}



export const getExpense = async (
    req: Request, 
    res: Response
) => {

    const { expenseNumber } = validateRequestParams(req);

    const expense = await getExpenseService(expenseNumber);

    return sendSuccess(
        res,
        HTTP_STATUS.OK,
        `Expense ${expenseNumber} retrieved successfully!`,
        expense
    )
}



export const getExpenseSummary = async (
    req: Request,
    res: Response
) => {

    const summary = await getExpenseSummaryService(expenseSummaryQuerySchema.parse(req.query));

    return sendSuccess(
        res,
        HTTP_STATUS.OK,
        "Expenses summary retrieved successfully!",
        summary
    )
}



export const updateExpense = async (
    req: Request, 
    res: Response
) => {

    const { expenseNumber } = validateRequestParams(req);

    const updatedExpense = await updateExpenseService(expenseNumber, req.body);

    return sendSuccess(
        res,
        HTTP_STATUS.OK,
        `Expense ${expenseNumber} updated successfully!`,
        updatedExpense
    )
}



export const deleteExpense = async (
    req: Request, 
    res: Response
) => {

    const { expenseNumber } = validateRequestParams(req);

    await deleteExpenseService(expenseNumber);

    return sendSuccess(
        res,
        HTTP_STATUS.OK,
        `Expense ${expenseNumber} deleted successfully!`,
    )
}
