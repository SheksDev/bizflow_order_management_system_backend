export const reportPaths = {
  "/api/v1/reports/profit": {
    get: {
      tags: ["Reports"],
      summary: "Get profit report",
      description:
        "Retrieve a profit report summary for a given date range, including gross revenue, refunds, net revenue, expenses (order and business), tips, profit, profit margin, and order/expense counts. Admin only.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "query",
          name: "startDate",
          required: true,
          schema: { type: "string", format: "date-time" },
          description: "Start of the reporting period",
        },
        {
          in: "query",
          name: "endDate",
          required: true,
          schema: { type: "string", format: "date-time" },
          description: "End of the reporting period",
        },
      ],
      responses: {
        "200": {
          description: "Profit report retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: {
                    type: "string",
                    example: "Profit report summary retrieved successfully!",
                  },
                  data: {
                    $ref: "#/components/schemas/ProfitReport",
                  },
                },
              },
            },
          },
        },
        "400": { description: "Bad request — start date must be before end date" },
        "401": { description: "Unauthorized" },
        "403": { description: "Forbidden — admin role required" },
      },
    },
  },
  "/api/v1/reports/profit/monthly": {
    get: {
      tags: ["Reports"],
      summary: "Get monthly profit report",
      description:
        "Retrieve a monthly breakdown of profit data for a given date range. Each month includes revenue, refunds, expenses, tips, profit, and counts. Admin only.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "query",
          name: "startDate",
          required: true,
          schema: { type: "string", format: "date-time" },
          description: "Start of the reporting period",
        },
        {
          in: "query",
          name: "endDate",
          required: true,
          schema: { type: "string", format: "date-time" },
          description: "End of the reporting period",
        },
      ],
      responses: {
        "200": {
          description: "Monthly profit report retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: {
                    type: "string",
                    example: "Profit report summary retrieved successfully!",
                  },
                  data: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/MonthlyProfitReportItem",
                    },
                  },
                },
              },
            },
          },
        },
        "400": { description: "Bad request — start date must be before end date" },
        "401": { description: "Unauthorized" },
        "403": { description: "Forbidden — admin role required" },
      },
    },
  },
  "/api/v1/reports/expenses": {
    get: {
      tags: ["Reports"],
      summary: "Get expense summary report",
      description:
        "Retrieve a summary of expenses for a given date range, including total amount, count, and breakdown by category. Filterable by order number and expense category. Admin and Staff roles.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "query",
          name: "startDate",
          required: false,
          schema: { type: "string", format: "date-time" },
          description: "Start of the reporting period",
        },
        {
          in: "query",
          name: "endDate",
          required: false,
          schema: { type: "string", format: "date-time" },
          description: "End of the reporting period",
        },
        {
          in: "query",
          name: "orderNumber",
          required: false,
          schema: { type: "string" },
          description: "Filter by associated order number",
        },
        {
          in: "query",
          name: "expenseCategoryId",
          required: false,
          schema: { type: "string" },
          description: "Filter by expense category ID",
        },
      ],
      responses: {
        "200": {
          description: "Expense summary retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: {
                    type: "string",
                    example: "Expenses summary retrieved successfully!",
                  },
                  data: {
                    $ref: "#/components/schemas/ExpenseSummaryReport",
                  },
                },
              },
            },
          },
        },
        "401": { description: "Unauthorized" },
      },
    },
  },
  "/api/v1/reports/expenses/monthly": {
    get: {
      tags: ["Reports"],
      summary: "Get monthly expense report",
      description:
        "Retrieve a monthly breakdown of expenses for a given date range. Each month includes total, order-related, business, and count. Admin only.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "query",
          name: "startDate",
          required: false,
          schema: { type: "string", format: "date-time" },
          description: "Start of the reporting period",
        },
        {
          in: "query",
          name: "endDate",
          required: false,
          schema: { type: "string", format: "date-time" },
          description: "End of the reporting period",
        },
      ],
      responses: {
        "200": {
          description: "Monthly expense report retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: {
                    type: "string",
                    example: "Expenses report retrieved successfully!",
                  },
                  data: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/MonthlyExpenseReportItem",
                    },
                  },
                },
              },
            },
          },
        },
        "401": { description: "Unauthorized" },
        "403": { description: "Forbidden — admin role required" },
      },
    },
  },
  "/api/v1/reports/cash-flow": {
    get: {
      tags: ["Reports"],
      summary: "Get cash flow report",
      description:
        "Retrieve a cash flow report for a given date range, including opening balance, inflow, outflow, net cash flow, closing balance, and breakdown by entry type. Admin only.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "query",
          name: "startDate",
          required: true,
          schema: { type: "string", format: "date-time" },
          description: "Start of the reporting period",
        },
        {
          in: "query",
          name: "endDate",
          required: true,
          schema: { type: "string", format: "date-time" },
          description: "End of the reporting period",
        },
      ],
      responses: {
        "200": {
          description: "Cash flow report retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: {
                    type: "string",
                    example: "Profit report summary retrieved successfully!",
                  },
                  data: {
                    $ref: "#/components/schemas/CashFlowReport",
                  },
                },
              },
            },
          },
        },
        "400": { description: "Bad request — start date must be before end date" },
        "401": { description: "Unauthorized" },
        "403": { description: "Forbidden — admin role required" },
      },
    },
  },
};
