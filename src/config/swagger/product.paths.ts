export const productPaths = {
  "/api/v1/product/create": {
    post: {
      tags: ["Product Category"],
      summary: "Create a product category",
      description: "Create a new product category. Requires ADMIN role.",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/CreateProductCategoryBody" },
          },
        },
      },
      responses: {
        "200": {
          description: "Product category created successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: {
                    type: "string",
                    example: "Product category created successfully!",
                  },
                  data: {
                    $ref: "#/components/schemas/ProductCategory",
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

  "/api/v1/product/all": {
    get: {
      tags: ["Product Category"],
      summary: "Get all product categories",
      description:
        "Retrieve all active product categories. Requires ADMIN or STAFF role.",
      security: [{ bearerAuth: [] }],
      responses: {
        "200": {
          description: "Product categories retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: {
                    type: "string",
                    example:
                      "Product categories retrieved successfully!",
                  },
                  data: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/ProductCategory",
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

  "/api/v1/product/{categoryId}": {
    get: {
      tags: ["Product Category"],
      summary: "Get a product category",
      description: "Retrieve a single product category by ID. Requires ADMIN role.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "categoryId",
          required: true,
          schema: { type: "string" },
          description: "Product category ID",
          example: "PROD-000001",
        },
      ],
      responses: {
        "200": {
          description: "Product category retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: {
                    type: "string",
                    example: "Product category retrieved successfully!",
                  },
                  data: {
                    $ref: "#/components/schemas/ProductCategory",
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
      tags: ["Product Category"],
      summary: "Update a product category",
      description: "Update a product category by ID. Requires ADMIN role.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "categoryId",
          required: true,
          schema: { type: "string" },
          description: "Product category ID",
          example: "PROD-000001",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/UpdateProductCategoryBody" },
          },
        },
      },
      responses: {
        "200": {
          description: "Product category updated successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: {
                    type: "string",
                    example:
                      "Product category PROD-000001 updated successfully!",
                  },
                  data: {
                    $ref: "#/components/schemas/ProductCategory",
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
    delete: {
      tags: ["Product Category"],
      summary: "Deactivate a product category",
      description: "Dactivate a product category by ID. Requires ADMIN role.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "categoryId",
          required: true,
          schema: { type: "string" },
          description: "Product category ID",
          example: "PROD-000001",
        },
      ],
      responses: {
        "200": {
          description: "Product category deleted successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: {
                    type: "string",
                    example:
                      "Product category PROD-000001 deleted successfully!",
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
  },
};
