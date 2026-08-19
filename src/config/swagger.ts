import swaggerJsdoc from "swagger-jsdoc";
import { components } from "./swagger/schemas.js";
import { authPaths } from "./swagger/auth.paths.js";
import { customerPaths } from "./swagger/customer.paths.js";
import { productPaths } from "./swagger/product.paths.js";
import { orderPaths } from "./swagger/order.paths.js";
import { expenseCategoryPaths } from "./swagger/expenseCategory.paths.js";
import { expensePaths } from "./swagger/expense.paths.js";
import { paymentPaths } from "./swagger/payment.paths.js";

const spec = {
  openapi: "3.0.3",
  info: {
    title: "BizFlow Backend API",
    description:
      "REST API for BizFlow — a business management platform for orders, customers, and product categories.",
    version: "1.0.0",
    contact: {
      name: "BizFlow Support",
    },
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "Local development server",
    },
  ],
  tags: [
    {
      name: "Auth",
      description: "User registration, login, token refresh, and logout.",
    },
    {
      name: "Customer",
      description: "Customer management — create, read, update, and delete.",
    },
    {
      name: "Product Category",
      description: "Product category management.",
    },    {
      name: "Order",
      description: "Order management — create, update status, add/cancel items, cancel orders.",
    },
    {
      name: "Expense Category",
      description: "Expense category management — create, read, update, and deactivate.",
    },
    {
      name: "Expense",
      description: "Expense recording, listing, summary, and management.",
    },
    {
      name: "Payment",
      description: "Payment recording for orders, retrieval, and refund processing.",
    },
  ],
  paths: {
    ...authPaths,
    ...customerPaths,
    ...productPaths,
    ...orderPaths,
    ...expenseCategoryPaths,
    ...expensePaths,
    ...paymentPaths,
  },
  components,
};

export const swaggerSpec = swaggerJsdoc({
  definition: spec,
  apis: [], // We define everything programmatically, no JSDoc scanning needed
});
