import swaggerJsdoc from "swagger-jsdoc";
import { components } from "./swagger/schemas.js";
import { authPaths } from "./swagger/auth.paths.js";
import { customerPaths } from "./swagger/customer.paths.js";
import { productPaths } from "./swagger/product.paths.js";
import { orderPaths } from "./swagger/order.paths.js";

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
    },
    {
      name: "Order",
      description: "Order management — create, update status, add/cancel items, cancel orders.",
    },
  ],
  paths: {
    ...authPaths,
    ...customerPaths,
    ...productPaths,
    ...orderPaths,
  },
  components,
};

export const swaggerSpec = swaggerJsdoc({
  definition: spec,
  apis: [], // We define everything programmatically, no JSDoc scanning needed
});
