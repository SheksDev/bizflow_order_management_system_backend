export const prismaErrors = {
    P2002: {
        status: 409,
        message: "Duplicate value."
    },

    P2025: {
        status: 404,
        message: "Record not found."
    },
} as const;