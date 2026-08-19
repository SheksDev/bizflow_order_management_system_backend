export const paymentPaths = {
  "/api/v1/payments/{orderNumber}/payments/create": {
    post: {
      tags: ["Payment"],
      summary: "Record a payment for an order",
      description:
        "Record a new payment against an order. Requires ADMIN or STAFF role.",
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
            schema: { $ref: "#/components/schemas/CreatePaymentBody" },
          },
        },
      },
      responses: {
        "201": {
          description: "Payment recorded successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: {
                    type: "string",
                    example: "Payment recorded successfully!",
                  },
                  data: { $ref: "#/components/schemas/Payment" },
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

  "/api/v1/payments/{orderNumber}/payments": {
    get: {
      tags: ["Payment"],
      summary: "Get all payments for an order",
      description:
        "Retrieve all payment records for a specific order. Requires ADMIN or STAFF role.",
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
          description: "Payment records retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: {
                    type: "string",
                    example:
                      "Order ORD-000001 payment records retrieved successfully!",
                  },
                  data: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Payment" },
                  },
                },
              },
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

  "/api/v1/payments/{paymentNumber}": {
    get: {
      tags: ["Payment"],
      summary: "Get a single payment",
      description:
        "Retrieve a single payment record by payment number. Requires ADMIN or STAFF role.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "paymentNumber",
          required: true,
          schema: { type: "string" },
          description: "Payment number",
          example: "PAY-000001",
        },
      ],
      responses: {
        "200": {
          description: "Payment retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: {
                    type: "string",
                    example:
                      "Payment PAY-000001 retrieved successfully!",
                  },
                  data: { $ref: "#/components/schemas/Payment" },
                },
              },
            },
          },
        },
        "400": {
          description: "Invalid payment number",
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
          description: "Payment not found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
  },

  "/api/v1/payments/{paymentNumber}/refunds/create": {
    post: {
      tags: ["Payment"],
      summary: "Process a refund on a payment",
      description:
        "Create a refund against an existing payment. Requires ADMIN role.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "paymentNumber",
          required: true,
          schema: { type: "string" },
          description: "Payment number to refund",
          example: "PAY-000001",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/CreateRefundBody" },
          },
        },
      },
      responses: {
        "201": {
          description: "Refund processed successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: {
                    type: "string",
                    example: "Refund processed successfully!",
                  },
                  data: { $ref: "#/components/schemas/Refund" },
                },
              },
            },
          },
        },
        "400": {
          description: "Invalid payment number or validation error",
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
          description: "Forbidden — requires ADMIN role",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        "404": {
          description: "Payment not found",
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
