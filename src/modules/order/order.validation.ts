import { z } from "zod";

export const orderItemBodySchema = z.object({

    categoryId: z.string(),
    productName: z.string().trim().min(1),

    quantity: z.coerce
        .number()
        .int()
        .positive(),

    unitPrice: z.coerce
        .number()
        .nonnegative(),

    details: z.record(z.string(), z.unknown()).optional(),
});

export const orderItemSchema = z.object({
    body: orderItemBodySchema,
});

export const updateOrderItemSchema = orderItemBodySchema.partial();

export type AddOrderItemDTO = z.infer<typeof orderItemBodySchema>;
export type UpdateOrderItemDTO = z.infer<typeof updateOrderItemSchema>;



export const createOrderBodySchema = z.object({

    customerId: z.string(),

    deliveryDate: z.coerce.date(),

    deliveryAddress: z.string().trim().optional(),

    deliveryMethod: z.enum([
        "PICKUP",
        "DELIVERY",
    ]),

    notes: z.string().trim().optional(),

    items: z
        .array(orderItemBodySchema)
        .min(1),
});

export const createOrderSchema = z.object({
    body: createOrderBodySchema,
});

export type CreateOrderDTO = z.infer<typeof createOrderBodySchema>;


export const getOrdersQuerySchema = z.object({

    page: z.coerce.number().int().min(1).default(1),

    limit: z.coerce
        .number()
        .int()
        .min(1)
        .max(100)
        .default(20),

    search: z.string().trim().optional(),

    status: z
        .enum([
            "PENDING",
            "CONFIRMED",
            "IN_PROGRESS",
            "READY",
            "OUT_FOR_DELIVERY",
            "DELIVERED",
            "COMPLETED",
            "CANCELLED",
        ])
        .optional(),

    customerId: z.string().optional(),

    deliveryDate: z.coerce.date().optional(),
});

export const getOrderSchema = z.object({
    params: z.object({
        orderNumber: z.string().optional(),
        itemId: z.string().optional(),
    }),
});


export const updateOrderBodySchema = z.object({

    deliveryDate: z.coerce.date().optional(),

    deliveryAddress: z.string().trim().optional(),

    deliveryMethod: z.enum([
        "PICKUP",
        "DELIVERY"
    ]).optional(),

    notes: z.string().trim().optional(),
});

export const updateOrderSchema = z.object({
    params: z.object({
        orderNumber: z.string().optional(),
        itemId: z.string().optional(),
    }),

    body: updateOrderBodySchema,
});

export type UpdateOrderDTO =  z.infer<typeof updateOrderBodySchema>;


export const updateOrderTotalBodySchema = z.object({
    total: z.coerce.number().nonnegative(),
});


export const updateOrderStatusBodySchema = z.object({
    status: z.enum([
        "PENDING",
        "CONFIRMED",
        "IN_PROGRESS",
        "READY",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "COMPLETED",
    ]),
});

export const updateOrderStatusSchema = z.object({
    params: z.object({
        orderNumber: z.string(),
    }),

    body: updateOrderStatusBodySchema,
});


export const cancelOrderBodySchema = z.object({
    reason: z.string().trim().min(3).max(500),
});

export const cancelOrderSchema = z.object({
    params: z.object({
        orderNumber: z.string(),
    }),

    body: cancelOrderBodySchema,
});