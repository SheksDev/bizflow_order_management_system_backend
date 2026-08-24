export const customerPaths = {
  "/api/v1/customers/create": {
    post: {
      tags: ["Customer"],
      summary: "Create a customer",
      description: "Create a new customer record.",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/CreateCustomerBody" },
          },
        },
      },
      responses: {
        "201": {
          description: "Customer created successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: {
                    type: "string",
                    example: "Customer Created Successfully!",
                  },
                  data: { $ref: "#/components/schemas/Customer" },
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
          description: "Forbidden — requires ADMIN or STAFF role",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
  },

  "/api/v1/customers/all": {
    get: {
      tags: ["Customer"],
      summary: "Get all customers",
      description:
        "Retrieve a paginated list of customers with optional search.",
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
          description: "Search term to filter customers by name or phone",
        },
      ],
      responses: {
        "200": {
          description: "Customers retrieved successfully",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CustomerListResponse" },
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

  "/api/v1/customers/{customerId}": {
    get: {
      tags: ["Customer"],
      summary: "Get a customer",
      description: "Retrieve a single customer by their ID (e.g. CUS-000001).",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "customerId",
          required: true,
          schema: { type: "string", pattern: "^CUS-\\d{6}$" },
          description: "Customer ID (format: CUS-XXXXXX)",
          example: "CUS-000001",
        },
      ],
      responses: {
        "200": {
          description: "Customer retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: {
                    type: "string",
                    example: "Customer retrieved successfully!",
                  },
                  data: { $ref: "#/components/schemas/Customer" },
                },
              },
            },
          },
        },
        "400": {
          description: "Invalid customer ID",
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
          description: "Customer not found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
    patch: {
      tags: ["Customer"],
      summary: "Update a customer",
      description: "Update a customer's details by ID.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "customerId",
          required: true,
          schema: { type: "string", pattern: "^CUS-\\d{6}$" },
          description: "Customer ID (format: CUS-XXXXXX)",
          example: "CUS-000001",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/UpdateCustomerBody" },
          },
        },
      },
      responses: {
        "200": {
          description: "Customer updated successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: {
                    type: "string",
                    example: "Customer updated successfully!",
                  },
                  data: { $ref: "#/components/schemas/Customer" },
                },
              },
            },
          },
        },
        "400": {
          description: "Invalid customer ID or validation error",
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
          description: "Customer not found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
    delete: {
      tags: ["Customer"],
      summary: "Delete a customer",
      description: "Soft-delete a customer by ID. Requires ADMIN role.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "customerId",
          required: true,
          schema: { type: "string", pattern: "^CUS-\\d{6}$" },
          description: "Customer ID (format: CUS-XXXXXX)",
          example: "CUS-000001",
        },
      ],
      responses: {
        "200": {
          description: "Customer deleted successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: {
                    type: "string",
                    example: "Customer deleted successfully!",
                  },
                  data: { $ref: "#/components/schemas/Customer" },
                },
              },
            },
          },
        },
        "400": {
          description: "Invalid customer ID",
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
          description: "Customer not found",
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
