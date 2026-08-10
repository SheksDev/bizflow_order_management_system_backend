import { sendSuccess } from "@/shared/utils/response.js";
import { 
    refreshAccessTokenService,
    registerUserService,
    userLoginService,
    userLogoutService
} from "./auth.service.js";
import type { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "@/shared/constants/http-status.js";
import { REFRESH_TOKEN_COOKIE, refreshTokenCookieOptions } from "@/shared/constants/cookies.js";
import { AppError } from "@/shared/errors/AppError.js";


// =========== REGISTER USER ================

export const registerUser = async (
    req: Request,
    res: Response
)   => {

    const user = await registerUserService(req.body);

    return sendSuccess(
        res,
        HTTP_STATUS.CREATED,
        "Account created successfully!",
        user
    )
}


// =========== LOGIN USER ================

export const userLogin = async (
    req: Request,
    res: Response
) => {

    const result = await userLoginService(req.body);

    res.cookie(
        REFRESH_TOKEN_COOKIE,
        result.refreshToken,
        refreshTokenCookieOptions
    )

    return sendSuccess(
        res, 
        HTTP_STATUS.OK,
        "Login Successful!",
        {
            accessToken: result.accessToken,
            user: result.user
        }
    )
}


// =========== REFRESH TOKEN ================

export const refreshAccessToken = async (
    req: Request,
    res: Response
) => {

    const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE];

    console.log(refreshToken);

    if (!refreshToken) {
        throw new AppError("Refresh token required", HTTP_STATUS.UNAUTHORIZED);
    }

    const result = await refreshAccessTokenService(refreshToken);

    res.cookie(
        REFRESH_TOKEN_COOKIE,
        result.refreshToken,
        refreshTokenCookieOptions
    );

    return sendSuccess(
        res,
        HTTP_STATUS.OK,
        "Token refreshed successfully",
        {
        accessToken: result.accessToken,
        }
    );
};


// =========== LOGOUT USER ================

export const userLogout = async (
    req: Request,
    res: Response
) => {

    await userLogoutService(req.user!.userId);

    res.clearCookie(
        REFRESH_TOKEN_COOKIE,
        refreshTokenCookieOptions
    );

    return sendSuccess(
        res,
        HTTP_STATUS.OK,
        "Logged out successfully"
    );
};

