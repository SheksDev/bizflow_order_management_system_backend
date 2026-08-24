export const orderPaths = {
  "/api/v1/orders/create": {
    post: {
      tags: ["Order"],
      summary: "Create an order",
      description:
        "Create a new order with one or more items. Requires ADMIN or STAFF role.",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/CreateOrderBody" },
          },
        },
      },
      responses: {
        "200": {
          description: "Order created successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: {
                    type: "string",
                    example: "Order created successfully!",
                  },
                  data: { $ref: "#/components/schemas/Order" },
                },
              },
            },
          },
        },
        "400": {
          description: "Validation error",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        "401": {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        "403": {
          description: "Forbidden",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
  },

  "/api/v1/orders/all": {
    get: {
      tags: ["Order"],
      summary: "Get all orders",
      description:
        "Retrieve a paginated list of orders with optional filters. Requires ADMIN or STAFF role.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "query",
          name: "page",
          schema: { type: "integer", minimum: 1, default: 1 },
          description: "Page number",
        },
        {
          in: "query",
          name: "limit",
          schema: { type: "integer", minimum: 1, maximum: 100, default: 20 },
          description: "Items per page",
        },
        {
          in: "query",
          name: "search",
          schema: { type: "string" },
          description: "Search term",
        },
        {
          in: "query",
          name: "status",
          schema: { $ref: "#/components/schemas/OrderStatus" },
          description: "Filter by order status",
        },
        {
          in: "query",
          name: "customerId",
          schema: { type: "string" },
          description: "Filter by customer ID",
        },
        {
          in: "query",
          name: "deliveryDate",
          schema: { type: "string", format: "date-time" },
          description: "Filter by delivery date",
        },
      ],
      responses: {
        "200": {
          description: "Orders retrieved successfully",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/OrderListResponse" },
            },
          },
        },
        "401": {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        "403": {
          description: "Forbidden",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
  },

  "/api/v1/orders/{orderNumber}/total": {
    patch: {
      tags: ["Order"],
      summary: "Update order total",
      description:
        "Manually update the total amount of an order. Requires ADMIN or STAFF role.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "orderNumber",
          required: true,
          schema: { type: "string" },
          description: "Order number",
          example: "ORD-000001",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/UpdateOrderTotalBody" },
          },
        },
      },
      responses: {
        "200": {
          description: "Order total updated successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: {
                    type: "string",
                    example: "Order ORD-000001 total updated successfully!",
                  },
                  data: { $ref: "#/components/schemas/Order" },
                },
              },
            },
          },
        },
        "400": {
          description: "Invalid order number or validation error",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        "401": {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        "403": {
          description: "Forbidden",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        "404": {
          description: "Order not found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
  },

  "/api/v1/orders/{orderNumber}/items": {
    post: {
      tags: ["Order"],
      summary: "Add an item to an order",
      description:
        "Add a new item to an existing order. Requires ADMIN or STAFF role.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "orderNumber",
          required: true,
          schema: { type: "string" },
          description: "Order number",
          example: "ORD-000001",
        },
        {
          in: "query",
          name: "categoryId",
          required: true,
          schema: { type: "string" },
          description: "Product category ID for the item",
          example: "PROD-000001",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/OrderItemBody" },
          },
        },
      },
      responses: {
        "200": {
          description: "Item added successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: {
                    type: "string",
                    example:
                      "New item added to order ORD-000001, category PROD-000001 successfully!",
                  },
                  data: { $ref: "#/components/schemas/OrderItem" },
                },
              },
            },
          },
        },
        "400": {
          description: "Invalid order number or validation error",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        "401": {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        "403": {
          description: "Forbidden",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        "404": {
          description: "Order not found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
  },

  "/api/v1/orders/{orderNumber}/items/{itemId}": {
    patch: {
      tags: ["Order"],
      summary: "Update an order item",
      description:
        "Update an existing item in an order. Requires ADMIN or STAFF role.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "orderNumber",
          required: true,
          schema: { type: "string" },
          description: "Order number",
          example: "ORD-000001",
        },
        {
          in: "path",
          name: "itemId",
          required: true,
          schema: { type: "string" },
          description: "Order item ID",
          example: "ITEM-000001",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/UpdateOrderItemBody" },
          },
        },
      },
      responses: {
        "200": {
          description: "Order item updated successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: {
                    type: "string",
                    example:
                      "Order ORD-000001, item ITEM-000001 successfully updated!",
                  },
                  data: { $ref: "#/components/schemas/OrderItem" },
                },
              },
            },
          },
        },
        "400": {
          description: "Invalid parameters",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        "401": {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        "403": {
          description: "Forbidden",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        "404": {
          description: "Order or item not found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
    delete: {
      tags: ["Order"],
      summary: "Cancel an order item",
      description:
        "Cancel/remove an item from an order. Requires ADMIN or STAFF role.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "orderNumber",
          required: true,
          schema: { type: "string" },
          description: "Order number",
          example: "ORD-000001",
        },
        {
          in: "path",
          name: "itemId",
          required: true,
          schema: { type: "string" },
          description: "Order item ID",
          example: "ITEM-000001",
        },
      ],
      responses: {
        "200": {
          description: "Order item cancelled successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: {
                    type: "string",
                    example:
                      "Order ORD-000001, item ITEM-000001 successfully cancelled!",
                  },
                  data: { $ref: "#/components/schemas/OrderItem" },
                },
              },
            },
          },
        },
        "400": {
          description: "Invalid parameters",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        "401": {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        "403": {
          description: "Forbidden",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        "404": {
          description: "Order or item not found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
  },

  "/api/v1/orders/{orderNumber}/status": {
    patch: {
      tags: ["Order"],
      summary: "Update order status",
      description:
        "Update the status of an order. Requires ADMIN or STAFF role.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "orderNumber",
          required: true,
          schema: { type: "string" },
          description: "Order number",
          example: "ORD-000001",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/UpdateOrderStatusBody" },
          },
        },
      },
      responses: {
        "200": {
          description: "Order status updated successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: {
                    type: "string",
                    example:
                      "Order ORD-000001 status successfully updated!",
                  },
                  data: { $ref: "#/components/schemas/Order" },
                },
              },
            },
          },
        },
        "400": {
          description: "Invalid order number or validation error",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        "401": {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        "403": {
          description: "Forbidden",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        "404": {
          description: "Order not found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
  },

  "/api/v1/orders/{orderNumber}/cancel": {
    post: {
      tags: ["Order"],
      summary: "Cancel an order",
      description:
        "Cancel an entire order with a reason. Requires ADMIN or STAFF role.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "orderNumber",
          required: true,
          schema: { type: "string" },
          description: "Order number",
          example: "ORD-000001",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/CancelOrderBody" },
          },
        },
      },
      responses: {
        "200": {
          description: "Order cancelled successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: {
                    type: "string",
                    example: "Order ORD-000001 successfully cancelled!",
                  },
                  data: { $ref: "#/components/schemas/Order" },
                },
              },
            },
          },
        },
        "400": {
          description: "Invalid order number or validation error",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        "401": {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        "403": {
          description: "Forbidden",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        "404": {
          description: "Order not found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
  },

  "/api/v1/orders/{orderNumber}": {
    get: {
      tags: ["Order"],
      summary: "Get an order",
      description: "Retrieve a single order by order number. Requires ADMIN or STAFF role.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "orderNumber",
          required: true,
          schema: { type: "string" },
          description: "Order number",
          example: "ORD-000001",
        },
      ],
      responses: {
        "200": {
          description: "Order retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: {
                    type: "string",
                    example: "Order ORD-000001 retrieved successfully!",
                  },
                  data: { $ref: "#/components/schemas/Order" },
                },
              },
            },
          },
        },
        "400": {
          description: "Invalid order number",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        "401": {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        "403": {
          description: "Forbidden",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        "404": {
          description: "Order not found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
    patch: {
      tags: ["Order"],
      summary: "Update an order",
      description:
        "Update delivery details of an order. Requires ADMIN or STAFF role.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "orderNumber",
          required: true,
          schema: { type: "string" },
          description: "Order number",
          example: "ORD-000001",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/UpdateOrderBody" },
          },
        },
      },
      responses: {
        "200": {
          description: "Order updated successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: {
                    type: "string",
                    example: "Order ORD-000001 updated successfully!",
                  },
                  data: { $ref: "#/components/schemas/Order" },
                },
              },
            },
          },
        },
        "400": {
          description: "Invalid order number or validation error",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        "401": {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        "403": {
          description: "Forbidden",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        "404": {
          description: "Order not found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
    delete: {
      tags: ["Order"],
      summary: "Delete an order",
      description: "Soft-delete an order. Requires ADMIN or STAFF role.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "orderNumber",
          required: true,
          schema: { type: "string" },
          description: "Order number",
          example: "ORD-000001",
        },
      ],
      responses: {
        "200": {
          description: "Order deleted successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: {
                    type: "string",
                    example: "Order ORD-000001 successfully deleted!",
                  },
                },
              },
            },
          },
        },
        "400": {
          description: "Invalid order number",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        "401": {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        "403": {
          description: "Forbidden",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        "404": {
          description: "Order not found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
  },
};
