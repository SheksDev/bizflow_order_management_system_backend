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
        categoryId: { type: "string", example: "PROD-000001" },
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
          example: "PROD-000001",
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
          example: "PROD-000001",
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
        orderNumber: { type: "string", example: "clxyz..." },
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

    // ─── Expense Category ───────────────────────────────
    CreateExpenseCategoryBody: {
      type: "object",
      required: ["name"],
      properties: {
        name: {
          type: "string",
          minLength: 2,
          maxLength: 100,
          example: "Office Supplies",
        },
        description: {
          type: "string",
          maxLength: 500,
          example: "General office supplies and materials",
        },
      },
    },
    UpdateExpenseCategoryBody: {
      type: "object",
      properties: {
        name: {
          type: "string",
          minLength: 2,
          maxLength: 100,
          example: "Office Supplies",
        },
        description: {
          type: "string",
          maxLength: 500,
          example: "General office supplies and materials",
        },
        isActive: {
          type: "boolean",
          example: true,
        },
      },
    },
    ExpenseCategory: {
      type: "object",
      properties: {
        id: { type: "string", example: "clxyz..." },
        categoryId: { type: "string", example: "ECAT-000001" },
        name: { type: "string", example: "Office Supplies" },
        description: {
          type: "string",
          example: "General office supplies and materials",
        },
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

    // ─── Expense ────────────────────────────────────────
    CreateExpenseBody: {
      type: "object",
      required: ["expenseCategoryId", "title", "amount"],
      properties: {
        orderNumber: {
          type: "string",
          example: "ORD-000001",
        },
        expenseCategoryId: {
          type: "string",
          example: "ECAT-000001",
        },
        title: {
          type: "string",
          minLength: 2,
          maxLength: 150,
          example: "Packaging materials",
        },
        amount: {
          type: "number",
          exclusiveMinimum: 0,
          example: 5000.0,
        },
        expenseDate: {
          type: "string",
          format: "date-time",
          example: "2026-01-15T10:30:00.000Z",
        },
        description: {
          type: "string",
          maxLength: 500,
          example: "Bubble wrap and boxes for order ORD-000001",
        },
        receiptUrl: {
          type: "string",
          format: "uri",
          example: "https://example.com/receipt.jpg",
        },
      },
    },
    UpdateExpenseBody: {
      type: "object",
      properties: {
        orderNumber: { type: "string", example: "ORD-000001" },
        expenseCategoryId: { type: "string", example: "ECAT-000001" },
        title: {
          type: "string",
          minLength: 2,
          maxLength: 150,
          example: "Packaging materials",
        },
        amount: {
          type: "number",
          exclusiveMinimum: 0,
          example: 5000.0,
        },
        expenseDate: {
          type: "string",
          format: "date-time",
          example: "2026-01-15T10:30:00.000Z",
        },
        description: {
          type: "string",
          maxLength: 500,
          example: "Bubble wrap and boxes",
        },
        receiptUrl: {
          type: "string",
          format: "uri",
          example: "https://example.com/receipt.jpg",
        },
      },
    },
    Expense: {
      type: "object",
      properties: {
        id: { type: "string", example: "clxyz..." },
        expenseNumber: { type: "string", example: "EXP-000001" },
        orderNumber: {
          type: "string",
          nullable: true,
          example: "ORD-000001",
        },
        expenseCategoryId: { type: "string", example: "clxyz..." },
        title: { type: "string", example: "Packaging materials" },
        amount: { type: "number", example: 5000.0 },
        expenseDate: {
          type: "string",
          format: "date-time",
          example: "2026-01-15T10:30:00.000Z",
        },
        description: {
          type: "string",
          example: "Bubble wrap and boxes",
        },
        receiptUrl: {
          type: "string",
          nullable: true,
          example: null,
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
      },
    },
    ExpenseListResponse: {
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        message: {
          type: "string",
          example: "Expenses retrieved successfully!",
        },
        data: {
          type: "object",
          properties: {
            expenses: {
              type: "array",
              items: { $ref: "#/components/schemas/Expense" },
            },
            pagination: {
              $ref: "#/components/schemas/PaginationMeta",
            },
          },
        },
      },
    },
    ExpenseSummary: {
      type: "object",
      properties: {
        totalAmount: { type: "number", example: 150000.0 },
        totalCount: { type: "integer", example: 25 },
        byCategory: {
          type: "array",
          items: {
            type: "object",
            properties: {
              categoryId: { type: "string", example: "ECAT-000001" },
              name: { type: "string", example: "Office Supplies" },
              total: { type: "number", example: 50000.0 },
              count: { type: "integer", example: 10 },
            },
          },
        },
      },
    },

    // ─── Payment ────────────────────────────────────────
    PaymentMethod: {
      type: "string",
      enum: ["CASH", "BANK_TRANSFER", "MOBILE_MONEY", "POS", "OTHER"],
    },
    RefundType: {
      type: "string",
      enum: ["PAYMENT", "TIP"],
    },
    CreatePaymentBody: {
      type: "object",
      required: ["amount", "paymentMethod"],
      properties: {
        amount: {
          type: "number",
          exclusiveMinimum: 0,
          example: 25000.0,
        },
        paymentMethod: { $ref: "#/components/schemas/PaymentMethod" },
        paymentDate: {
          type: "string",
          format: "date-time",
          example: "2026-01-15T10:30:00.000Z",
        },
        reference: {
          type: "string",
          example: "TRF-20260115-001",
        },
        tipAmount: {
          type: "number",
          minimum: 0,
          default: 0,
          example: 2000.0,
        },
        notes: {
          type: "string",
          example: "Partial payment for order",
        },
      },
    },
    Payment: {
      type: "object",
      properties: {
        id: { type: "string", example: "clxyz..." },
        paymentNumber: { type: "string", example: "PAY-000001" },
        orderId: { type: "string", example: "clxyz..." },
        amount: { type: "number", example: 25000.0 },
        paymentMethod: { $ref: "#/components/schemas/PaymentMethod" },
        paymentDate: {
          type: "string",
          format: "date-time",
          example: "2026-01-15T10:30:00.000Z",
        },
        paymentSource: {
          type: "string",
          enum: ["MANUAL", "ONLINE"],
          example: "MANUAL",
        },
        reference: {
          type: "string",
          nullable: true,
          example: "TRF-20260115-001",
        },
        isTip: { type: "boolean", example: false },
        notes: { type: "string", example: "Partial payment" },
        createdAt: {
          type: "string",
          format: "date-time",
          example: "2026-01-15T10:30:00.000Z",
        },
      },
    },
    CreateRefundBody: {
      type: "object",
      required: ["amount", "refundMethod", "refundType", "reason"],
      properties: {
        amount: {
          type: "number",
          exclusiveMinimum: 0,
          example: 10000.0,
        },
        refundMethod: { $ref: "#/components/schemas/PaymentMethod" },
        refundType: { $ref: "#/components/schemas/RefundType" },
        reason: {
          type: "string",
          minLength: 3,
          maxLength: 500,
          example: "Customer returned item",
        },
        refundDate: {
          type: "string",
          format: "date-time",
          example: "2026-01-20T10:30:00.000Z",
        },
        reference: {
          type: "string",
          example: "REF-20260120-001",
        },
      },
    },
    Refund: {
      type: "object",
      properties: {
        id: { type: "string", example: "clxyz..." },
        refundNumber: { type: "string", example: "REF-000001" },
        paymentId: { type: "string", example: "clxyz..." },
        amount: { type: "number", example: 10000.0 },
        refundMethod: { $ref: "#/components/schemas/PaymentMethod" },
        refundType: { $ref: "#/components/schemas/RefundType" },
        reason: { type: "string", example: "Customer returned item" },
        refundDate: {
          type: "string",
          format: "date-time",
          example: "2026-01-20T10:30:00.000Z",
        },
        reference: {
          type: "string",
          nullable: true,
          example: "REF-20260120-001",
        },
        createdAt: {
          type: "string",
          format: "date-time",
          example: "2026-01-20T10:30:00.000Z",
        },
      },
    },

    // ─── Ledger Entry ─────────────────────────────────
    LedgerEntryType: {
      type: "string",
      enum: [
        "ORDER_PAYMENT",
        "TIP",
        "EXPENSE",
        "REFUND",
        "ADJUSTMENT",
        "OPENING_BALANCE",
      ],
    },
    LedgerDirection: {
      type: "string",
      enum: ["IN", "OUT"],
    },
    LedgerEntry: {
      type: "object",
      properties: {
        id: { type: "string", example: "clxyz..." },
        entryNumber: { type: "string", example: "LEDGER-000001" },
        type: { $ref: "#/components/schemas/LedgerEntryType" },
        direction: { $ref: "#/components/schemas/LedgerDirection" },
        amount: { type: "number", example: 25000.0 },
        balanceAfter: { type: "number", example: 175000.0 },
        description: {
          type: "string",
          nullable: true,
          example: "Payment for order ORD-000001",
        },
        referenceType: {
          type: "string",
          enum: ["PAYMENT", "EXPENSE", "REFUND", "OPENING_BALANCE", "ADJUSTMENT"],
          example: "PAYMENT",
        },
        referenceId: { type: "string", example: "PAY-000001" },
        orderNumber: {
          type: "string",
          nullable: true,
          example: "ORD-000001",
        },
        ledgerAccountId: { type: "string", example: "clxyz..." },
        createdById: { type: "string", example: "clxyz..." },
        createdAt: {
          type: "string",
          format: "date-time",
          example: "2026-01-15T10:30:00.000Z",
        },
      },
    },
    LedgerEntryListResponse: {
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        message: {
          type: "string",
          example: "Ledger entries retrieved successfully!",
        },
        data: {
          type: "object",
          properties: {
            entries: {
              type: "array",
              items: { $ref: "#/components/schemas/LedgerEntry" },
            },
            pagination: {
              $ref: "#/components/schemas/PaginationMeta",
            },
          },
        },
      },
    },
    LedgerBalance: {
      type: "object",
      properties: {
        id: { type: "string", example: "clxyz..." },
        name: { type: "string", example: "MAIN_CASH" },
        currentBalance: { type: "number", example: 250000.0 },
        createdAt: {
          type: "string",
          format: "date-time",
          example: "2026-01-01T00:00:00.000Z",
        },
        updatedAt: {
          type: "string",
          format: "date-time",
          example: "2026-01-15T10:30:00.000Z",
        },
      },
    },

    // ─── Reports ──────────────────────────────────────
    DateRangeQuery: {
      type: "object",
      required: ["startDate", "endDate"],
      properties: {
        startDate: {
          type: "string",
          format: "date-time",
          example: "2026-01-01T00:00:00.000Z",
        },
        endDate: {
          type: "string",
          format: "date-time",
          example: "2026-01-31T23:59:59.999Z",
        },
      },
    },
    ProfitReport: {
      type: "object",
      properties: {
        period: {
          type: "object",
          properties: {
            startDate: { type: "string", format: "date-time" },
            endDate: { type: "string", format: "date-time" },
          },
        },
        revenue: {
          type: "object",
          properties: {
            gross: { type: "number", example: 500000.0 },
            refunds: { type: "number", example: 15000.0 },
            net: { type: "number", example: 485000.0 },
          },
        },
        tips: { type: "number", example: 20000.0 },
        expenses: {
          type: "object",
          properties: {
            order: { type: "number", example: 50000.0 },
            business: { type: "number", example: 30000.0 },
            total: { type: "number", example: 80000.0 },
          },
        },
        profit: { type: "number", example: 405000.0 },
        profitMargin: { type: "number", example: 83.5 },
        orderCount: { type: "integer", example: 25 },
        expenseCount: { type: "integer", example: 15 },
      },
    },
    MonthlyProfitReportItem: {
      type: "object",
      properties: {
        month: { type: "string", example: "2026-01" },
        revenue: {
          type: "object",
          properties: {
            gross: { type: "number", example: 200000.0 },
            refunds: { type: "number", example: 5000.0 },
            net: { type: "number", example: 195000.0 },
          },
        },
        tips: { type: "number", example: 8000.0 },
        expenses: {
          type: "object",
          properties: {
            order: { type: "number", example: 20000.0 },
            business: { type: "number", example: 10000.0 },
            total: { type: "number", example: 30000.0 },
          },
        },
        profit: { type: "number", example: 165000.0 },
        profitMargin: { type: "number", example: 84.6 },
        orderCount: { type: "integer", example: 10 },
        expenseCount: { type: "integer", example: 6 },
      },
    },
    CashFlowReport: {
      type: "object",
      properties: {
        period: {
          type: "object",
          properties: {
            startDate: { type: "string", format: "date-time" },
            endDate: { type: "string", format: "date-time" },
          },
        },
        openingBalance: { type: "number", example: 100000.0 },
        inflow: { type: "number", example: 500000.0 },
        outflow: { type: "number", example: 80000.0 },
        netCashFlow: { type: "number", example: 420000.0 },
        closingBalance: { type: "number", example: 520000.0 },
        byType: {
          type: "array",
          items: {
            type: "object",
            properties: {
              type: { $ref: "#/components/schemas/LedgerEntryType" },
              direction: { $ref: "#/components/schemas/LedgerDirection" },
              amount: { type: "number", example: 200000.0 },
            },
          },
        },
      },
    },
    ExpenseSummaryReport: {
      type: "object",
      properties: {
        period: {
          type: "object",
          properties: {
            startDate: { type: "string", format: "date-time" },
            endDate: { type: "string", format: "date-time" },
          },
        },
        totalExpenses: { type: "number", example: 150000.0 },
        expenseCount: { type: "integer", example: 25 },
        byCategory: {
          type: "array",
          items: {
            type: "object",
            properties: {
              categoryId: { type: "string", example: "ECAT-000001" },
              categoryName: { type: "string", example: "Office Supplies" },
              amount: { type: "number", example: 50000.0 },
              count: { type: "integer", example: 10 },
            },
          },
        },
      },
    },
    MonthlyExpenseReportItem: {
      type: "object",
      properties: {
        month: { type: "string", example: "2026-01" },
        total: { type: "number", example: 30000.0 },
        order: { type: "number", example: 20000.0 },
        business: { type: "number", example: 10000.0 },
        count: { type: "integer", example: 6 },
      },
    },
  },
};
