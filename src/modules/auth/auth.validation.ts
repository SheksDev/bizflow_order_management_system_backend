import { email, z } from "zod";

const registerBodySchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.email(),
    password: z.string().min(8),
    phone: z.string().optional(),
});

export const registerSchema = z.object({
    body: registerBodySchema,
});

export type RegisterDTO = z.infer<typeof registerBodySchema>;


const loginBodySchema = z.object({
    email: z.email(),
    password: z.string().min(8),
})

export const loginSchema = z.object({
    body: loginBodySchema
});

export type LoginDTO = z.infer<typeof loginBodySchema>;