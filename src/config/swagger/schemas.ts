export const components = {
  securitySchemes: {
    bearerAuth: {
      type: "apiKey",
      in: "header",
      name: "Authorization",
      description:
        "Enter `Bearer <token>` — obtain a token from the login endpoint.",
    },
    cookieAuth: {
      type: "apiKey",
      in: "cookie",
      name: "refresh_token",
      description:
        "Automatically set by the login endpoint. Used by the refresh endpoint.",
    },
  },

  schemas: {
    // ─── Enumerations ────────────────────────────────────
    UserRole: {
      type: "string",
      enum: ["ADMIN", "STAFF"],
    },
    DeliveryMethod: {
      type: "string",
      enum: ["PICKUP", "DELIVERY"],
    },
    OrderStatus: {
      type: "string",
      enum: [
        "PENDING",
        "CONFIRMED",
        "IN_PROGRESS",
        "READY",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "COMPLETED",
        "CANCELLED",
      ],
    },
    OrderItemStatus: {
      type: "string",
      enum: [
        "PENDING",
        "CONFIRMED",
        "PREPARING",
        "READY",
        "DELIVERED",
        "CANCELLED",
      ],
    },

    // ─── Generic Wrappers ────────────────────────────────
    SuccessResponse: {
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        message: { type: "string" },
        data: {},
      },
    },
    ErrorResponse: {
      type: "object",
      properties: {
        success: { type: "boolean", example: false },
        message: { type: "string" },
        errors: {},
      },
    },
    PaginationMeta: {
      type: "object",
      properties: {
        page: { type: "integer", example: 1 },
        limit: { type: "integer", example: 20 },
        total: { type: "integer", example: 42 },
        totalPages: { type: "integer", example: 3 },
      },
    },

    // ─── Auth ────────────────────────────────────────────
    RegisterBody: {
      type: "object",
      required: ["firstName", "lastName", "email", "password"],
      properties: {
        firstName: { type: "string", example: "John" },
        lastName: { type: "string", example: "Doe" },
        email: {
          type: "string",
          format: "email",
          example: "john@example.com",
        },
        password: {
          type: "string",
          minLength: 8,
          example: "secret1234",
        },
        phone: { type: "string", example: "+2348012345678" },
      },
    },
    RegisterResponse: {
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        message: { type: "string", example: "Account created successfully!" },
        data: {
          type: "object",
          properties: {
            userId: { type: "string", example: "USR-000001" },
            firstName: { type: "string", example: "John" },
            lastName: { type: "string", example: "Doe" },
            email: {
              type: "string",
              format: "email",
              example: "john@example.com",
            },
            phone: { type: "string", example: "+2348012345678" },
            role: { $ref: "#/components/schemas/UserRole" },
          },
        },
      },
    },
    LoginBody: {
      type: "object",
      required: ["email", "password"],
      properties: {
        email: {
          type: "string",
          format: "email",
          example: "john@example.com",
        },
        password: {
          type: "string",
          minLength: 8,
          example: "secret1234",
        },
      },
    },
    LoginResponse: {
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        message: { type: "string", example: "Login Successful!" },
        data: {
          type: "object",
          properties: {
            accessToken: {
              type: "string",
              example: "eyJhbGciOiJIUzI1NiIs...",
            },
            user: {
              type: "object",
              properties: {
                userId: { type: "string", example: "USR-000001" },
                firstName: { type: "string", example: "John" },
                lastName: { type: "string", example: "Doe" },
                email: {
                  type: "string",
                  format: "email",
                  example: "john@example.com",
                },
                phone: { type: "string", example: "+2348012345678" },
                role: { $ref: "#/components/schemas/UserRole" },
              },
            },
          },
        },
      },
    },
    RefreshTokenResponse: {
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        message: {
          type: "string",
          example: "Token refreshed successfully",
        },
        data: {
          type: "object",
          properties: {
            accessToken: {
              type: "string",
              example: "eyJhbGciOiJIUzI1NiIs...",
            },
          },
        },
      },
    },
    LogoutResponse: {
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        message: { type: "string", example: "Logged out successfully" },
      },
    },

    // ─── Customer ────────────────────────────────────────
    CreateCustomerBody: {
      type: "object",
      required: ["name", "phone"],
      properties: {
        name: {
          type: "string",
          minLength: 2,
          maxLength: 100,
          example: "Acme Corp",
        },
        phone: {
          type: "string",
          minLength: 7,
          maxLength: 20,
          example: "+2348012345678",
        },
        email: {
          type: "string",
          format: "email",
          example: "contact@acme.com",
        },
        address: {
          type: "string",
          maxLength: 255,
          example: "123 Main St, Lagos",
        },
        notes: {
          type: "string",
          maxLength: 1000,
          example: "VIP customer",
        },
      },
    },
    UpdateCustomerBody: {
      type: "object",
      properties: {
        name: {
          type: "string",
          minLength: 2,
          maxLength: 100,
          example: "Acme Corp",
        },
        phone: {
          type: "string",
          minLength: 7,
          maxLength: 20,
          example: "+2348012345678",
        },
        email: {
          type: "string",
          format: "email",
          example: "contact@acme.com",
        },
        address: {
          type: "string",
          maxLength: 255,
          example: "123 Main St, Lagos",
        },
        notes: {
          type: "string",
          maxLength: 1000,
          example: "VIP customer",
        },
      },
    },
    Customer: {
      type: "object",
      properties: {
        id: { type: "string", example: "clxyz..." },
        customerId: { type: "string", example: "CUS-000001" },
        name: { type: "string", example: "Acme Corp" },
        phone: { type: "string", example: "+2348012345678" },
        email: { type: "string", example: "contact@acme.com" },
        defaultAddress: { type: "string", example: "123 Main St, Lagos" },
        notes: { type: "string", example: "VIP customer" },
        createdAt: {
          type: "string",
          format: "date-time",
          example: "2026-01-15T10:30:00.000Z",
        },
        updatedAt: {
          type: "string",
          format: "date-time",
          example: "2026-01-15T10:30:00.000Z",
        },
      },
    },
    CustomerListResponse: {
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        message: {
          type: "string",
          example: "All customers retrieved successfully",
        },
        data: {
          type: "object",
          properties: {
            customers: {
              type: "array",
              items: { $ref: "#/components/schemas/Customer" },
            },
            pagination: {
              $ref: "#/components/schemas/PaginationMeta",
            },
          },
        },
      },
    },

    // ─── Product Category ────────────────────────────────
    CreateProductCategoryBody: {
      type: "object",
      required: ["name"],
      properties: {
        name: {
          type: "string",
          minLength: 2,
          maxLength: 100,
          example: "Cakes",
        },
        description: {
          type: "string",
          maxLength: 500,
          example: "All types of cakes",
        },
      },
    },
    UpdateProductCategoryBody: {
      type: "object",
      properties: {
        name: {
          type: "string",
          minLength: 2,
          maxLength: 100,
          example: "Cakes",
        },
        description: {
          type: "string",
          maxLength: 500,
          example: "All types of cakes",
        },
      },
    },
    ProductCategory: {
      type: "object",
      properties: {
        id: { type: "string", example: "clxyz..." },
        categoryId: { type: "string", example: "PCAT-000001" },
        name: { type: "string", example: "Cakes" },
        description: { type: "string", example: "All types of cakes" },
        isActive: { type: "boolean", example: true },
        createdAt: {
          type: "string",
          format: "date-time",
          example: "2026-01-15T10:30:00.000Z",
        },
        updatedAt: {
          type: "string",
          format: "date-time",
          example: "2026-01-15T10:30:00.000Z",
        },
      },
    },

    // ─── Order ───────────────────────────────────────────
    OrderItemBody: {
      type: "object",
      required: ["categoryId", "productName", "quantity", "unitPrice"],
      properties: {
        categoryId: {
          type: "string",
          example: "PCAT-000001",
        },
        productName: {
          type: "string",
          minLength: 1,
          example: "Birthday Cake",
        },
        quantity: {
          type: "integer",
          minimum: 1,
          example: 2,
        },
        unitPrice: {
          type: "number",
          minimum: 0,
          example: 15000.0,
        },
        details: {
          type: "object",
          additionalProperties: true,
          example: { size: "3-tier", flavour: "Vanilla" },
        },
      },
    },
    UpdateOrderItemBody: {
      type: "object",
      properties: {
        categoryId: {
          type: "string",
          example: "PCAT-000001",
        },
        productName: {
          type: "string",
          minLength: 1,
          example: "Birthday Cake",
        },
        quantity: {
          type: "integer",
          minimum: 1,
          example: 2,
        },
        unitPrice: {
          type: "number",
          minimum: 0,
          example: 15000.0,
        },
        details: {
          type: "object",
          additionalProperties: true,
          example: { size: "3-tier", flavour: "Vanilla" },
        },
      },
    },
    OrderItem: {
      type: "object",
      properties: {
        id: { type: "string", example: "clxyz..." },
        itemId: { type: "string", example: "ITEM-000001" },
        orderId: { type: "string", example: "clxyz..." },
        productCategoryId: { type: "string", example: "clxyz..." },
        productName: { type: "string", example: "Birthday Cake" },
        quantity: { type: "integer", example: 2 },
        unitPrice: { type: "number", example: 15000.0 },
        totalPrice: { type: "number", example: 30000.0 },
        details: {
          type: "object",
          example: { size: "3-tier", flavour: "Vanilla" },
        },
        status: { $ref: "#/components/schemas/OrderItemStatus" },
        createdAt: {
          type: "string",
          format: "date-time",
          example: "2026-01-15T10:30:00.000Z",
        },
        updatedAt: {
          type: "string",
          format: "date-time",
          example: "2026-01-15T10:30:00.000Z",
        },
      },
    },
    CreateOrderBody: {
      type: "object",
      required: ["customerId", "deliveryDate", "deliveryMethod", "items"],
      properties: {
        customerId: {
          type: "string",
          example: "CUS-000001",
        },
        deliveryDate: {
          type: "string",
          format: "date-time",
          example: "2026-02-01T12:00:00.000Z",
        },
        deliveryAddress: {
          type: "string",
          example: "123 Main St, Lagos",
        },
        deliveryMethod: { $ref: "#/components/schemas/DeliveryMethod" },
        notes: {
          type: "string",
          example: "Deliver before noon",
        },
        items: {
          type: "array",
          minItems: 1,
          items: { $ref: "#/components/schemas/OrderItemBody" },
        },
      },
    },
    UpdateOrderBody: {
      type: "object",
      properties: {
        deliveryDate: {
          type: "string",
          format: "date-time",
          example: "2026-02-01T12:00:00.000Z",
        },
        deliveryAddress: {
          type: "string",
          example: "123 Main St, Lagos",
        },
        deliveryMethod: { $ref: "#/components/schemas/DeliveryMethod" },
        notes: {
          type: "string",
          example: "Deliver before noon",
        },
      },
    },
    UpdateOrderTotalBody: {
      type: "object",
      required: ["total"],
      properties: {
        total: {
          type: "number",
          minimum: 0,
          example: 75000.0,
        },
      },
    },
    UpdateOrderStatusBody: {
      type: "object",
      required: ["status"],
      properties: {
        status: { $ref: "#/components/schemas/OrderStatus" },
      },
    },
    CancelOrderBody: {
      type: "object",
      required: ["reason"],
      properties: {
        reason: {
          type: "string",
          minLength: 3,
          maxLength: 500,
          example: "Customer requested cancellation",
        },
      },
    },
    Order: {
      type: "object",
      properties: {
        id: { type: "string", example: "clxyz..." },
        orderNumber: { type: "string", example: "ORD-000001" },
        customerId: { type: "string", example: "clxyz..." },
        orderDate: {
          type: "string",
          format: "date-time",
          example: "2026-01-15T10:30:00.000Z",
        },
        deliveryDate: {
          type: "string",
          format: "date-time",
          example: "2026-02-01T12:00:00.000Z",
        },
        deliveryAddress: {
          type: "string",
          example: "123 Main St, Lagos",
        },
        deliveryMethod: { $ref: "#/components/schemas/DeliveryMethod" },
        status: { $ref: "#/components/schemas/OrderStatus" },
        originalTotal: { type: "number", example: 75000.0 },
        currentTotal: { type: "number", example: 60000.0 },
        notes: { type: "string", example: "Deliver before noon" },
        items: {
          type: "array",
          items: { $ref: "#/components/schemas/OrderItem" },
        },
        createdAt: {
          type: "string",
          format: "date-time",
          example: "2026-01-15T10:30:00.000Z",
        },
        updatedAt: {
          type: "string",
          format: "date-time",
          example: "2026-01-15T10:30:00.000Z",
        },
        cancelledAt: {
          type: "string",
          format: "date-time",
          nullable: true,
          example: null,
        },
        cancelReason: {
          type: "string",
          nullable: true,
          example: null,
        },
      },
    },
    OrderListResponse: {
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        message: {
          type: "string",
          example: "All orders retrieved successfully!",
        },
        data: {
          type: "object",
          properties: {
            orders: {
              type: "array",
              items: { $ref: "#/components/schemas/Order" },
            },
            pagination: {
              $ref: "#/components/schemas/PaginationMeta",
            },
          },
        },
      },
    },
  },
};
