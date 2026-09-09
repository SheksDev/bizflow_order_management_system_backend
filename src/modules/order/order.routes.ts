import { authorize } from "@/shared/middleware/rbac.middleware.js";
import { validate } from "@/shared/middleware/validate.middleware.js";
import { UserRole } from "@prisma/client";
import { Router } from "express";
import { cancelOrderSchema, createOrderSchema, getOrderSchema, getOrdersQuerySchema, orderItemSchema, updateOrderItemSchema, updateOrderSchema, updateOrderStatusSchema, updateOrderTotalBodySchema } from "./order.validation.js";
import { asyncHandler } from "@/shared/handlers/asyncHandler.js";
import { addOrderItem, cancelOrder, cancelOrderItem, createOrder, deleteOrder, getAllOrders, getOrder, getOrderBalance, updateOrder, updateOrderItem, updateOrderStatus, updateOrderTotal } from "./order.controller.js";


const router = Router();


router.post(
    "/create",
    authorize(UserRole.ADMIN, UserRole.STAFF),
    validate(createOrderSchema),
    asyncHandler(createOrder)
)


router.get(
    "/all",
    authorize(UserRole.ADMIN, UserRole.STAFF),
    validate(getOrdersQuerySchema),
    asyncHandler(getAllOrders)
)


router.patch(
    "/:orderNumber/total",
    authorize(UserRole.ADMIN, UserRole.STAFF),
    validate(getOrderSchema),
    validate(updateOrderTotalBodySchema),
    asyncHandler(updateOrderTotal)
)


router.post(
    "/:orderNumber/items",
    authorize(UserRole.ADMIN, UserRole.STAFF),
    validate(getOrderSchema),
    validate(orderItemSchema),
    asyncHandler(addOrderItem)
)


router.patch(
    "/:orderNumber/items/:itemId",
    authorize(UserRole.ADMIN, UserRole.STAFF),
    validate(getOrderSchema),
    validate(updateOrderItemSchema),
    asyncHandler(updateOrderItem)
)


router.delete(
    "/:orderNumber/items/:itemId",
    authorize(UserRole.ADMIN, UserRole.STAFF),
    validate(getOrderSchema),
    asyncHandler(cancelOrderItem)
)


router.patch(
    "/:orderNumber/status",
    authorize(UserRole.ADMIN, UserRole.STAFF),
    validate(updateOrderStatusSchema),
    asyncHandler(updateOrderStatus)
)


router.post(
    "/:orderNumber/cancel",
    authorize(UserRole.ADMIN, UserRole.STAFF),
    validate(cancelOrderSchema),
    asyncHandler(cancelOrder)
)


router.get(
    "/:orderNumber/balance",
    authorize(UserRole.ADMIN, UserRole.STAFF),
    validate(getOrderSchema),
    asyncHandler(getOrderBalance)
)


router.patch(
    "/:orderNumber",
    authorize(UserRole.ADMIN, UserRole.STAFF),
    validate(getOrderSchema),
    validate(updateOrderSchema),
    asyncHandler(updateOrder)
)


router.get(
    "/:orderNumber",
    authorize(UserRole.ADMIN, UserRole.STAFF),
    validate(getOrderSchema),
    asyncHandler(getOrder)
)


router.delete(
    "/:orderNumber",
    authorize(UserRole.ADMIN, UserRole.STAFF),
    validate(getOrderSchema),
    asyncHandler(deleteOrder)
)

export default router;