// order.constants.ts

import { OrderStatus } from "@prisma/client";

export const ORDER_STATUS_TRANSITIONS = {
    PENDING: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["IN_PROGRESS", "CANCELLED"],
    IN_PROGRESS: ["READY", "CANCELLED"],
    READY: ["OUT_FOR_DELIVERY"],
    OUT_FOR_DELIVERY: ["DELIVERED"],
    DELIVERED: ["COMPLETED"],
    COMPLETED: [],
    CANCELLED: [],
} as const;

export const canTransitionOrderStatus = (
    currentStatus: OrderStatus,
    nextStatus: OrderStatus
) => {
    return ORDER_STATUS_TRANSITIONS[currentStatus]
        .includes(nextStatus as never);
};