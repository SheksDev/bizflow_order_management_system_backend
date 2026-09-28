export const dashboardPaths = {
  "/api/v1/dashboard/summary": {
    get: {
      tags: ["Dashboard"],
      summary: "Get dashboard summary",
      description:
        "Retrieve a period-based dashboard summary — order counts (active, pending, completed, cancelled, unpaid balances), financial metrics (gross order value, payments received, balance due, expenses), and percentage comparisons against the immediately preceding period of equal length.\n\n" +
        "**Period selection:**\n" +
        "- `period=current_month` — the current calendar month\n" +
        "- `period=previous_month` — the previous calendar month\n" +
        "- `period=custom` — a single day (`date`) or a whole month (`month`)\n\n" +
        "`date` and `month` are only valid when `period=custom`, and exactly one of them must be provided.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "query",
          name: "period",
          required: true,
          schema: {
            type: "string",
            enum: ["current_month", "previous_month", "custom"],
          },
          description:
            "Reporting period. `current_month` and `previous_month` resolve to their calendar months; `custom` requires `date` or `month`.",
          example: "current_month",
        },
        {
          in: "query",
          name: "date",
          required: false,
          schema: {
            type: "string",
            format: "date",
            pattern: "^\\d{4}-\\d{2}-\\d{2}$",
            example: "2026-09-15",
          },
          description:
            "Single day to summarize (local midnight to midnight). Only valid with `period=custom`. Mutually exclusive with `month`.",
        },
        {
          in: "query",
          name: "month",
          required: false,
          schema: {
            type: "string",
            pattern: "^\\d{4}-\\d{2}$",
            example: "2026-09",
          },
          description:
            "Calendar month (YYYY-MM) to summarize. Only valid with `period=custom`. Mutually exclusive with `date`.",
        },
      ],
      responses: {
        "200": {
          description: "Dashboard summary retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: {
                    type: "string",
                    example: "Dashboard summary retrieved successfully!",
                  },
                  data: { $ref: "#/components/schemas/DashboardSummary" },
                },
              },
            },
          },
        },
        "400": {
          description:
            "Validation error — invalid `period` value; `date`/`month` used without `period=custom`; `period=custom` without `date` or `month`; or both `date` and `month` supplied",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        "401": { description: "Unauthorized" },
        "403": {
          description: "Forbidden — requires ADMIN role",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        "500": {
          description: "Main cash ledger account not configured",
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
