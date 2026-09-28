export const businessPaths = {
  "/api/v1/business": {
    get: {
      tags: ["Business"],
      summary: "Get business configuration",
      description:
        "Retrieve the business configuration profile — name, contact details, currency, bank account, social handles, and receipt footer. Requires ADMIN or STAFF role.",
      security: [{ bearerAuth: [] }],
      responses: {
        "200": {
          description: "Business configuration retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: {
                    type: "string",
                    example: "Business retrieved successfully!",
                  },
                  data: { $ref: "#/components/schemas/Business" },
                },
              },
            },
          },
        },
        "401": { description: "Unauthorized" },
        "404": {
          description: "Business configuration not found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
    patch: {
      tags: ["Business"],
      summary: "Update business configuration",
      description:
        "Update one or more fields of the business configuration. All fields are optional — only provided fields are updated. Requires ADMIN role.",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/UpdateBusinessBody" },
          },
        },
      },
      responses: {
        "200": {
          description: "Business configuration updated successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: {
                    type: "string",
                    example: "Business updated successfully!",
                  },
                  data: { $ref: "#/components/schemas/Business" },
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
        "401": { description: "Unauthorized" },
        "403": {
          description: "Forbidden — requires ADMIN role",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        "404": {
          description: "Business configuration not found",
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
