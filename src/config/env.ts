import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({

    NODE_ENV: z.enum(["development", "production", "test"]),

    PORT: z.coerce.number().default(5000),

    DATABASE_URL: z.string().min(1),

    JWT_ACCESS_SECRET: z.string().min(32),
    JWT_REFRESH_SECRET: z.string().min(32),

    ACCESS_TOKEN_EXPIRES_IN: z.string(),
    REFRESH_TOKEN_EXPIRES_IN: z.string(),

    REDIS_URL: z.string().url(),

    EMAIL_HOST: z.string().optional(),
    EMAIL_PORT: z.coerce.number().optional(),
    EMAIL_USER: z.string().optional(),
    EMAIL_PASSWORD: z.string().optional(),

    CLOUDINARY_CLOUD_NAME: z.string().optional(),
    CLOUDINARY_API_KEY: z.string().optional(),
    CLOUDINARY_API_SECRET: z.string().optional(),
});

const validateEnv = () => {
    const parsed = envSchema.safeParse(process.env);

    if (!parsed.success) {

        console.error(parsed.error.format());

        process.exit(1);

        throw new Error("Invalid environment variables.");
    }

    return parsed.data;
};

export const env = validateEnv();