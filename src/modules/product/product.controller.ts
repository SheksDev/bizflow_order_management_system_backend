import type { Request, Response, NextFunction } from "express";
import { createProductCategoryService, deactivateProductCategoryService, getAProductCategoryService, getProductCategoriesService, updateProductCategoryService } from "./product.service.js";
import { sendSuccess } from "@/shared/utils/response.js";
import { HTTP_STATUS } from "@/shared/constants/http-status.js";
import { AppError } from "@/shared/errors/AppError.js";


export const createProductCategory = async (
    req: Request,
    res: Response
) => {

    const product = await createProductCategoryService(req.body);

    sendSuccess(
        res,
        HTTP_STATUS.OK,
        "Product category created successfully!",
        product
    )
}

export const getProductCategories = async (
    req: Request,
    res: Response
) => {

    const result = await getProductCategoriesService();

    sendSuccess(
        res,
        HTTP_STATUS.OK,
        "Product categories retrieved successfully!",
        result
    )
}

export const getAProductCategory = async (
    req: Request,
    res: Response
) => {

    const { categoryId } = req.params;

    if(typeof categoryId !== "string") {
        throw new AppError("Invalid Customer Id", HTTP_STATUS.BAD_REQUEST)
    }

    const result = await getAProductCategoryService(categoryId);

    sendSuccess(
        res,
        HTTP_STATUS.OK,
        `Product category retrieved successfully!`,
        result
    )
}

export const updateProductCategory = async (
    req: Request,
    res: Response
) => {

    const { categoryId } = req.params;

    if(typeof categoryId !== "string") {
        throw new AppError("Invalid Customer Id", HTTP_STATUS.BAD_REQUEST)
    }

    const category = await updateProductCategoryService(categoryId, req.body);

    sendSuccess(
        res,
        HTTP_STATUS.OK,
        `Product category ${category.categoryId} updated successfully!`,
        category
    )
}

export const deactivateProductCategory = async (
    req: Request,
    res: Response
) => {

    const { categoryId } = req.params;

    if(typeof categoryId !== "string") {
        throw new AppError("Invalid Customer Id", HTTP_STATUS.BAD_REQUEST)
    }

    await deactivateProductCategoryService(categoryId);

    sendSuccess(
        res,
        HTTP_STATUS.OK,
        `Producy category ${categoryId} deleted successfully!`,
    )
}