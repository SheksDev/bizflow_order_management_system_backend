import express from "express";
import { ErrorHandler } from "@/shared/middleware/error.middleware.js";
import type { Request, Response, NextFunction } from "express";
import authRoutes from "@/modules/auth/auth.routes.js";
import customerRoutes from "@/modules/customer/customer.routes.js";
import productRoutes from "@/modules/product/product.routes.js";
import orderRoutes from "@/modules/order/order.routes.js";
import paymentRoutes from "@/modules/payment/payment.routes.js";
import expenseCategoryRoutes from "@/modules/expense/expenseCategory.routes.js";
import expenseRoutes from "@/modules/expense/expense.routes.js";
import cookieParser from "cookie-parser";
import { authenticate } from "./shared/middleware/auth.middleware.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";

const app = express();

export const API_V1 = "/api/v1";

const logger = (req: Request, res: Response, next: NextFunction) => {
    console.log("Someone visited:", req.method, req.url, new Date().toLocaleString());

    next();
}

app.use(express.json());

app.use(logger);

app.use(cookieParser());

app.use(`${API_V1}/auth`, authRoutes);

app.use(`${API_V1}/customers`, authenticate, customerRoutes);

app.use(`${API_V1}/products`, authenticate, productRoutes);

app.use(`${API_V1}/orders`, authenticate, orderRoutes, paymentRoutes);

app.use(`${API_V1}/payments`, authenticate, paymentRoutes);

app.use(`${API_V1}/expense-categories`, authenticate, expenseCategoryRoutes);

app.use(`${API_V1}/expenses`, authenticate, expenseRoutes);

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(ErrorHandler);

export default app;