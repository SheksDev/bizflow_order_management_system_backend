export const expensePaths = {
  "/api/v1/expenses/create": {
    post: {
      tags: ["Expense"],
      summary: "Record a new expense",
      description:
        "Record a new expense. Requires ADMIN or STAFF role.",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/CreateExpenseBody" },
          },
        },
      },
      responses: {
        "201": {
          description: "Expense recorded successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: {
                    type: "string",
                    example: "Expense recorded successfully",
                  },
                  data: { $ref: "#/components/schemas/Expense" },
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

  "/api/v1/expenses/all": {
    get: {
      tags: ["Expense"],
      summary: "Get all expenses",
      description:
        "Retrieve a paginated list of expenses with optional filters. Requires ADMIN or STAFF role.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "query",
          name: "orderNumber",
          schema: { type: "string" },
          description: "Filter by order number",
        },
        {
          in: "query",
          name: "expenseCategoryId",
          schema: { type: "string" },
          description: "Filter by expense category ID",
        },
        {
          in: "query",
          name: "startDate",
          schema: { type: "string", format: "date-time" },
          description: "Filter expenses from this date",
        },
        {
          in: "query",
          name: "endDate",
          schema: { type: "string", format: "date-time" },
          description: "Filter expenses up to this date",
        },
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
      ],
      responses: {
        "200": {
          description: "Expenses retrieved successfully",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ExpenseListResponse" },
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

  // "/api/v1/expenses/summary": {
  //   get: {
  //     tags: ["Expense"],
  //     summary: "Get expense summary",
  //     description:
  //       "Retrieve a summary of expenses with optional filters. Requires ADMIN or STAFF role.",
  //     security: [{ bearerAuth: [] }],
  //     parameters: [
  //       {
  //         in: "query",
  //         name: "startDate",
  //         schema: { type: "string", format: "date-time" },
  //         description: "Filter from this date",
  //       },
  //       {
  //         in: "query",
  //         name: "endDate",
  //         schema: { type: "string", format: "date-time" },
  //         description: "Filter up to this date",
  //       },
  //       {
  //         in: "query",
  //         name: "orderNumber",
  //         schema: { type: "string" },
  //         description: "Filter by order number",
  //       },
  //       {
  //         in: "query",
  //         name: "expenseCategoryId",
  //         schema: { type: "string" },
  //         description: "Filter by expense category ID",
  //       },
  //     ],
  //     responses: {
  //       "200": {
  //         description: "Expenses summary retrieved successfully",
  //         content: {
  //           "application/json": {
  //             schema: {
  //               type: "object",
  //               properties: {
  //                 success: { type: "boolean", example: true },
  //                 message: {
  //                   type: "string",
  //                   example: "Expenses summary retrieved successfully!",
  //                 },
  //                 data: {
  //                   $ref: "#/components/schemas/ExpenseSummary",
  //                 },
  //               },
  //             },
  //           },
  //         },
  //       },
  //       "401": {
  //         description: "Unauthorized",
  //         content: {
  //           "application/json": {
  //             schema: { $ref: "#/components/schemas/ErrorResponse" },
  //           },
  //         },
  //       },
  //       "403": {
  //         description: "Forbidden",
  //         content: {
  //           "application/json": {
  //             schema: { $ref: "#/components/schemas/ErrorResponse" },
  //           },
  //         },
  //       },
  //     },
  //   },
  // },

  "/api/v1/expenses/{expenseNumber}": {
    get: {
      tags: ["Expense"],
      summary: "Get a single expense",
      description:
        "Retrieve a single expense by expense number. Requires ADMIN or STAFF role.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "expenseNumber",
          required: true,
          schema: { type: "string" },
          description: "Expense number",
          example: "EXP-000001",
        },
      ],
      responses: {
        "200": {
          description: "Expense retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: {
                    type: "string",
                    example: "Expense EXP-000001 retrieved successfully!",
                  },
                  data: { $ref: "#/components/schemas/Expense" },
                },
              },
            },
          },
        },
        "400": {
          description: "Invalid expense number",
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
          description: "Expense not found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
    patch: {
      tags: ["Expense"],
      summary: "Update an expense",
      description:
        "Update an existing expense by expense number. Requires ADMIN role.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "expenseNumber",
          required: true,
          schema: { type: "string" },
          description: "Expense number",
          example: "EXP-000001",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/UpdateExpenseBody" },
          },
        },
      },
      responses: {
        "200": {
          description: "Expense updated successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: {
                    type: "string",
                    example: "Expense EXP-000001 updated successfully!",
                  },
                  data: { $ref: "#/components/schemas/Expense" },
                },
              },
            },
          },
        },
        "400": {
          description: "Invalid expense number or validation error",
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
          description: "Expense not found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
    delete: {
      tags: ["Expense"],
      summary: "Delete an expense",
      description: "Delete an expense by expense number. Requires ADMIN role.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "expenseNumber",
          required: true,
          schema: { type: "string" },
          description: "Expense number",
          example: "EXP-000001",
        },
      ],
      responses: {
        "200": {
          description: "Expense deleted successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: {
                    type: "string",
                    example: "Expense EXP-000001 deleted successfully!",
                  },
                },
              },
            },
          },
        },
        "400": {
          description: "Invalid expense number",
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
          description: "Expense not found",
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
