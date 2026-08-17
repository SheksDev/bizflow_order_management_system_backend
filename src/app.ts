import express from "express";
import { ErrorHandler } from "@/shared/middleware/error.middleware.js";
import type { Request, Response, NextFunction } from "express";
import authRoutes from "@/modules/auth/auth.routes.js";
import customerRoutes from "@/modules/customer/customer.routes.js";
import productRoutes from "@/modules/product/product.routes.js";
import orderRoutes from "@/modules/order/order.routes.js";
import cookieParser from "cookie-parser";
import { authenticate } from "./shared/middleware/auth.middleware.js";

const app = express();

const API_V1 = "/api/v1";

const logger = (req: Request, res: Response, next: NextFunction) => {
    console.log("Someone visited:", req.method, req.url, new Date().toLocaleString());

    next();
}

app.use(express.json());

app.use(logger);

app.use(cookieParser());

app.use(`${API_V1}/auth`, authRoutes);

app.use(`${API_V1}/customer`, authenticate, customerRoutes);

app.use(`${API_V1}/product`, authenticate, productRoutes);

app.use(`${API_V1}/order`, authenticate, orderRoutes);

app.use(ErrorHandler);

export default app;