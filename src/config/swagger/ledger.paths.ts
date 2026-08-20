export const ledgerPaths = {
  "/api/v1/ledger/all": {
    get: {
      tags: ["Ledger Entry"],
      summary: "Get all ledger entries",
      description:
        "Retrieve a paginated list of ledger entries. Filterable by type, direction, order number, and date range. Admin only.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "query",
          name: "page",
          schema: { type: "integer", default: 1, minimum: 1 },
          description: "Page number",
        },
        {
          in: "query",
          name: "limit",
          schema: { type: "integer", default: 20, minimum: 1, maximum: 100 },
          description: "Items per page",
        },
        {
          in: "query",
          name: "type",
          schema: { $ref: "#/components/schemas/LedgerEntryType" },
          description: "Filter by entry type",
        },
        {
          in: "query",
          name: "direction",
          schema: { $ref: "#/components/schemas/LedgerDirection" },
          description: "Filter by direction (IN or OUT)",
        },
        {
          in: "query",
          name: "orderNumber",
          schema: { type: "string" },
          description: "Filter by associated order number",
        },
        {
          in: "query",
          name: "startDate",
          schema: { type: "string", format: "date-time" },
          description: "Filter entries created on or after this date",
        },
        {
          in: "query",
          name: "endDate",
          schema: { type: "string", format: "date-time" },
          description: "Filter entries created before this date",
        },
      ],
      responses: {
        "200": {
          description: "Ledger entries retrieved successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/LedgerEntryListResponse",
              },
            },
          },
        },
        "401": { description: "Unauthorized" },
        "403": { description: "Forbidden — admin role required" },
      },
    },
  },
  "/api/v1/ledger/balance": {
    get: {
      tags: ["Ledger Entry"],
      summary: "Get ledger balance",
      description:
        "Retrieve the current balance of the main cash ledger account. Admin only.",
      security: [{ bearerAuth: [] }],
      responses: {
        "200": {
          description: "Ledger balance retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: {
                    type: "string",
                    example: "Ledger balance retrieved successfully!",
                  },
                  data: {
                    $ref: "#/components/schemas/LedgerBalance",
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
  "/api/v1/ledger/{entryNumber}": {
    get: {
      tags: ["Ledger Entry"],
      summary: "Get a ledger entry by entry number",
      description:
        "Retrieve a single ledger entry with full details including order, creator, and account info. Admin only.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "entryNumber",
          required: true,
          schema: { type: "string" },
          description: "The ledger entry number (e.g. LEDGER-000001)",
        },
      ],
      responses: {
        "200": {
          description: "Ledger entry retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: {
                    type: "string",
                    example: "Ledger entry LEDGER-000001 retrieved successfully!",
                  },
                  data: {
                    $ref: "#/components/schemas/LedgerEntry",
                  },
                },
              },
            },
          },
        },
        "401": { description: "Unauthorized" },
        "403": { description: "Forbidden — admin role required" },
        "404": { description: "Ledger entry not found" },
      },
    },
  },
};
