import { env } from "@/config/env.js";

export const REFRESH_TOKEN_COOKIE = "refreshToken";

export const refreshTokenCookieOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: 7 * 24 * 60 * 60 * 1000,
};