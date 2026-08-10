import { UserRole } from "@/generated/prisma/index.js"

export type User = {
    id: string,
    userId: string,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    role: UserRole
}