import { HTTP_STATUS } from "@/shared/constants/http-status.js";
import { sendSuccess } from "@/shared/utils/response.js";
import type { Request, Response, NextFunction } from "express";
import { createExpenseCategoryService, deactivateExpenseCategoryService, getExpenseCategoriesService, getExpenseCategoryService, updateExpenseCategoryService } from "./expenseCategory.service.js";
import { AppError } from "@/shared/errors/AppError.js";



const validateRequestParams =  (
    req: Request,
) => {

    const { categoryId } = req.params;
    
    if(typeof categoryId !== "string") {
        throw new AppError("Invalid Category Id", HTTP_STATUS.BAD_REQUEST)
    }

    return categoryId
}




export const createExpenseCategory = async (
    req: Request,
    res: Response
) => {

    const category = await createExpenseCategoryService(req.body);

    return sendSuccess(
        res,
        HTTP_STATUS.CREATED,
        "Expense category created successfully!",
        category
    )
}



export const getExpenseCategories = async (
    req: Request,
    res: Response
) => {

    const categories = await getExpenseCategoriesService()

    return sendSuccess(
        res,
        HTTP_STATUS.OK,
        "Expense categories retrieved successfully!",
        categories
    )
}



export const getExpenseCategory = async (
    req: Request,
    res: Response
) => {

    const categoryId = validateRequestParams(req);

    const category = await getExpenseCategoryService(categoryId);

    return sendSuccess(
        res,
        HTTP_STATUS.OK,
        `Expense category ${categoryId} retrieved successfully!`,
        category
    )
}



export const updateExpenseCategory = async (
    req: Request,
    res: Response
) => {

    const categoryId = validateRequestParams(req);

    const updatedCategory = await updateExpenseCategoryService(categoryId, req.body);

    return sendSuccess(
        res,
        HTTP_STATUS.OK,
        `Expense category ${categoryId} updated successfully!`,
        updatedCategory
    )
}



export const deactivateExpenseCategory = async (
    req: Request,
    res: Response
) => {

    const categoryId = validateRequestParams(req);

    await deactivateExpenseCategoryService(categoryId);

    return sendSuccess(
        res,
        HTTP_STATUS.OK,
        `Expense category ${categoryId} deactivated successfully!`,
    )
}