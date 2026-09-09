import type { Request, Response, NextFunction } from "express";
import { addOrderItemService, cancelOrderItemService, cancelOrderService, createOrderService, deleteOrderService, getAllOrdersService, getOrderBalanceService, getOrderService, updateOrderItemService, updateOrderService, updateOrderStatusService, updateOrderTotalService } from "./order.service.js";
import { sendSuccess } from "@/shared/utils/response.js";
import { HTTP_STATUS } from "@/shared/constants/http-status.js";
import { AppError } from "@/shared/errors/AppError.js";


const validateOrderRequestParams =  (
    req: Request,
) => {

    const { orderNumber, itemId } = req.params;
    
    if(typeof orderNumber !== "string") {
        throw new AppError("Invalid Order Number", HTTP_STATUS.BAD_REQUEST)
    }

    if(itemId !== undefined && typeof itemId !== "string") {
        throw new AppError("Invalid Item Id", HTTP_STATUS.BAD_REQUEST)
    }

    return {
        orderNumber,
        itemId
    };
}



export const createOrder = async (
    req: Request,
    res: Response
) => {

    const order = await createOrderService(req.body, req.user!.id);

    sendSuccess(
        res,
        HTTP_STATUS.OK,
        "Order created successfully!",
        order
    )
}



export const getAllOrders = async (
    req: Request,
    res: Response
) => {

    const result = await getAllOrdersService(req.query);

    const { page, limit, total, totalPages } = result.pagination;

    return sendSuccess(
        res, 
        HTTP_STATUS.OK,
        "All orders retrieved successfully!",
        {
            orders: result.orders,
            pagination: {
                page: page,
                limit: limit,
                total: total,
                totalPages: totalPages
            }
        }
    )
}



export const getOrder = async (
    req: Request,
    res: Response
) => {

    const { orderNumber } = validateOrderRequestParams(req)

    const order = await getOrderService(orderNumber);

    return sendSuccess(
        res,
        HTTP_STATUS.OK,
        `Order ${orderNumber} retrieved successfully!`,
        order
    )
}



export const updateOrder = async (
    req: Request,
    res: Response
) => {

    const { orderNumber } = validateOrderRequestParams(req)

    const order = await updateOrderService(orderNumber, req.body);

    return sendSuccess(
        res,
        HTTP_STATUS.OK,
        `Order ${orderNumber} updated successfully!`,
        order
    )
}



export const updateOrderTotal = async (
    req: Request,
    res: Response
) => {

    const { orderNumber } = validateOrderRequestParams(req);

    const order = await updateOrderTotalService(orderNumber, req.body);

    return sendSuccess(
        res,
        HTTP_STATUS.OK,
        `Order ${orderNumber} total updated successfully!`,
        order
    )
}



export const addOrderItem = async (
    req: Request,
    res: Response
) => {

    const { orderNumber } = validateOrderRequestParams(req);

    // const { categoryId } = req.query;
    
    // if(typeof categoryId !== "string") {
    //     throw new AppError("Invalid Category Id!", HTTP_STATUS.BAD_REQUEST)
    // }

    const item = await addOrderItemService(orderNumber, req.body)

    return sendSuccess(
        res,
        HTTP_STATUS.OK,
        `New item added to order ${orderNumber}, category ${item.productCategoryId} successfully!`,
        item
    )
}



export const updateOrderItem = async (
    req: Request,
    res: Response
) => {

    const { orderNumber, itemId } = validateOrderRequestParams(req);

    const item = await updateOrderItemService(orderNumber, itemId, req.body);

    return sendSuccess(
        res,
        HTTP_STATUS.OK,
        `Order ${orderNumber}, item ${itemId} successfully updated!`,
        item
    )
}






export const updateOrderStatus = async (
    req: Request,
    res: Response
) => {

    const { orderNumber } = validateOrderRequestParams(req);

    const order = updateOrderStatusService(orderNumber, req.body);

    return sendSuccess(
        res,
        HTTP_STATUS.OK,
        `Order ${orderNumber} status successfully updated!`,
        order
    )
}



export const cancelOrderItem  = async (
    req: Request,
    res: Response
) => {

    const { orderNumber, itemId } = validateOrderRequestParams(req);

    const item = await cancelOrderItemService(orderNumber, itemId);

    return sendSuccess(
        res,
        HTTP_STATUS.OK,
        `Order ${orderNumber}, item ${itemId} successfully cancelled!`,
        item
    )
}



export const cancelOrder  = async (
    req: Request,
    res: Response
) => {

    const { orderNumber } = validateOrderRequestParams(req);

    const order = await cancelOrderService(orderNumber, req.body);

    return sendSuccess(
        res,
        HTTP_STATUS.OK,
        `Order ${orderNumber} successfully cancelled!`,
        order
    )
}



export const deleteOrder  = async (
    req: Request,
    res: Response
) => {

    const { orderNumber } = validateOrderRequestParams(req);

    await deleteOrderService(orderNumber);

    return sendSuccess(
        res,
        HTTP_STATUS.OK,
        `Order ${orderNumber} successfully deleted!`,
    )
}



export const getOrderBalance = async (
    req: Request,
    res: Response
) => {

    const { orderNumber } = validateOrderRequestParams(req);

    const result = await getOrderBalanceService(orderNumber);

    return sendSuccess(
        res, 
        HTTP_STATUS.OK,
        `Balance for ${orderNumber} retrieved successfully!`,
        result
    )
}