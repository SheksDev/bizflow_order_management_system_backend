export const expenseCategoryPaths = {
  "/api/v1/expense-categories/create": {
    post: {
      tags: ["Expense Category"],
      summary: "Create an expense category",
      description:
        "Create a new expense category. Requires ADMIN role.",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/CreateExpenseCategoryBody",
            },
          },
        },
      },
      responses: {
        "201": {
          description: "Expense category created successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: {
                    type: "string",
                    example: "Expense category created successfully!",
                  },
                  data: {
                    $ref: "#/components/schemas/ExpenseCategory",
                  },
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
          description: "Forbidden — requires ADMIN role",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        "409": {
          description: "Category name already exists",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
  },

  "/api/v1/expense-categories/all": {
    get: {
      tags: ["Expense Category"],
      summary: "Get all expense categories",
      description:
        "Retrieve all active expense categories. Requires ADMIN or STAFF role.",
      security: [{ bearerAuth: [] }],
      responses: {
        "200": {
          description: "Expense categories retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: {
                    type: "string",
                    example: "Expense categories retrieved successfully!",
                  },
                  data: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/ExpenseCategory",
                    },
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
      },
    },
  },

  "/api/v1/expense-categories/{categoryId}": {
    get: {
      tags: ["Expense Category"],
      summary: "Get an expense category",
      description:
        "Retrieve a single expense category by ID. Requires ADMIN or STAFF role.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "categoryId",
          required: true,
          schema: { type: "string" },
          description: "Expense category ID",
          example: "ECAT-000001",
        },
      ],
      responses: {
        "200": {
          description: "Expense category retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: {
                    type: "string",
                    example:
                      "Expense category ECAT-000001 retrieved successfully!",
                  },
                  data: {
                    $ref: "#/components/schemas/ExpenseCategory",
                  },
                },
              },
            },
          },
        },
        "400": {
          description: "Invalid category ID",
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
          description: "Category not found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
    patch: {
      tags: ["Expense Category"],
      summary: "Update an expense category",
      description:
        "Update an expense category by ID. Requires ADMIN role.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "categoryId",
          required: true,
          schema: { type: "string" },
          description: "Expense category ID",
          example: "ECAT-000001",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/UpdateExpenseCategoryBody",
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Expense category updated successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: {
                    type: "string",
                    example:
                      "Expense category ECAT-000001 updated successfully!",
                  },
                  data: {
                    $ref: "#/components/schemas/ExpenseCategory",
                  },
                },
              },
            },
          },
        },
        "400": {
          description: "Invalid category ID or validation error",
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
          description: "Category not found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
    delete: {
      tags: ["Expense Category"],
      summary: "Deactivate an expense category",
      description:
        "Soft-deactivate an expense category by ID. Requires ADMIN role.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "categoryId",
          required: true,
          schema: { type: "string" },
          description: "Expense category ID",
          example: "ECAT-000001",
        },
      ],
      responses: {
        "200": {
          description: "Expense category deactivated successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: {
                    type: "string",
                    example:
                      "Expense category ECAT-000001 deactivated successfully!",
                  },
                },
              },
            },
          },
        },
        "400": {
          description: "Invalid category ID",
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
          description: "Category not found",
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
