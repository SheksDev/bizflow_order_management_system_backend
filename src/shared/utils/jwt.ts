import jwt from "jsonwebtoken";
import { env } from "@/config/env.js";
import { UserRole } from "@/generated/prisma/index.js";

type User = {
    id: string,
    userId: string,
    email: string,
    role: UserRole
}


export const generateAccessToken = async (user: User) => {

    const token = jwt.sign(
        {
            id: user.id,
            userId: user.userId,
            email: user.email,
            role: user.role
        },

        env.JWT_ACCESS_SECRET!,

        {
            expiresIn: "1h"
        }
    );

    return token;
}

export const generateRefreshToken = async (user: User) => {

    const refreshToken = jwt.sign(
        {
            id: user.id,
            userId: user.userId,
            email: user.email,
        },

        env.JWT_REFRESH_SECRET!,

        {
            expiresIn: "1d"
        }
    );

    return refreshToken;
}

// verifyAccessToken()

export const verifyRefreshToken = async (token: string) => {
    return jwt.verify(token, env.JWT_REFRESH_SECRET);
}