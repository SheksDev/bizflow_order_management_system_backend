import { prisma } from "@/config/prisma.js";
import type { LoginDTO, RegisterDTO } from "./auth.validation.js";
import { AppError } from "@/shared/errors/AppError.js";
import { HTTP_STATUS } from "@/shared/constants/http-status.js";
import { USER_SELECT } from "@/shared/constants/prisma-select.js";
import { comparePassword, hashPassword } from "@/shared/utils/password.js";
import { generatePublicId } from "@/shared/utils/generate-public-id.js";
import { Prisma } from "@prisma/client";
import { 
    generateAccessToken, 
    generateRefreshToken,
    verifyRefreshToken
} from "@/shared/utils/jwt.js";
import { JwtUserPayload } from "@/types/express.js";
import bcrypt from "bcrypt";


const findExistingUser = async (email: string) => {

    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    })

    if(!user) {
        throw new AppError("User does not exist", HTTP_STATUS.NOT_FOUND);
    }

    return user;
}


// =========== REGISTER USER ================

export const registerUserService = async (
    data: RegisterDTO
) => {

    const existingUser = await prisma.user.findUnique({
        where: {
            email: data.email,
        },
    });

    if (existingUser) {
        throw new AppError("Email already exists", HTTP_STATUS.CONFLICT);
    }

    const passwordHash = await hashPassword(data.password);

    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {

        const sequence = await generatePublicId(tx, "USER");

        const userId = `USER-${String(sequence).padStart(6, "0")}`;

        const user = await tx.user.create({

            data: {
                userId,

                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phone: data.phone,
                role: data.role,

                passwordHash,
            },

            select: USER_SELECT,
        });

        return user;

    });

};


// =========== LOGIN USER ================

export const userLoginService = async (
    data: LoginDTO
) => {

    const user = await findExistingUser(data.email);

    const isPasswordValid = await comparePassword(data.password, user.passwordHash);

    if(!isPasswordValid) {
        throw new AppError("Inavlid email or password!", HTTP_STATUS.NOT_FOUND)
    }

    const accessToken = await generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);
    const refreshTokenHash = await bcrypt.hash(refreshToken, 12);

    await prisma.user.update({

        where: {
            id: user.id
        },

        data: {
            hashedRefreshToken: refreshTokenHash 
        }
    })

    return {
        accessToken: accessToken,
        refreshToken: refreshToken,
        user: {
            id: user.id,
            userId: user.userId,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role
        }
    }
}


// =========== REFRESH TOKEN ================

export const refreshAccessTokenService = async (
    refreshToken: string
) => {

    const decoded = await verifyRefreshToken(refreshToken);

    if (typeof decoded === "string") {
        throw new AppError("Invalid refresh token", HTTP_STATUS.NOT_FOUND);
    }

    const user = await prisma.user.findUnique({
        where: {
        userId: decoded.userId,
        },
    });

    if (!user || !user.hashedRefreshToken) {
        throw new AppError("Invalid refresh token", HTTP_STATUS.NOT_FOUND)
    }

    const valid = await comparePassword(
        refreshToken,
        user.hashedRefreshToken
    );

    if (!valid) {
        throw new AppError("Invalid refresh token", HTTP_STATUS.NOT_FOUND)
    }

    const newAccessToken = await generateAccessToken(user);
    const newRefreshToken = await generateRefreshToken(user);

    await prisma.user.update({
        where: {
            id: user.id,
        },
        data: {
            hashedRefreshToken: newRefreshToken,
        },
    });

    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
    };
};


// =========== LOGOUT USER ================

export const userLogoutService = async (
    userId: string
) => {

    await prisma.user.update({
        where: {
            userId,
        },
        data: {
            hashedRefreshToken: null,
        },
    });
};