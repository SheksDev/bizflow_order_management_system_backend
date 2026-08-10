import { UserRole } from "@/generated/prisma/index.js";


export type JwtUserPayload = {
    id: string,
    userId: string,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    role: UserRole,
};

declare global {
    namespace Express {
        interface Request {
        user?: JwtUserPayload;
        }
    }
}

export {};