export const receiptPaths = {
  "/api/v1/receipts/{receiptNumber}": {
    get: {
      tags: ["Receipt"],
      summary: "Get a payment receipt",
      description:
        "Retrieve a payment receipt by receipt number, including customer details, full order with line items and product categories, payment info, and financial totals (order payment, tip received, total received). Requires ADMIN or STAFF role.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "receiptNumber",
          required: true,
          schema: { type: "string" },
          description: "The receipt number",
          example: "RCPT-000001",
        },
      ],
      responses: {
        "200": {
          description: "Receipt retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: {
                    type: "string",
                    example: "Receipt retrieved successfully!",
                  },
                  data: { $ref: "#/components/schemas/ReceiptResponse" },
                },
              },
            },
          },
        },
        "401": { description: "Unauthorized" },
        "404": {
          description: "Receipt not found",
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
