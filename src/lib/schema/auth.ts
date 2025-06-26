import { z } from "zod";

const emailSchema = z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" })
    .max(255, { message: "Email must be less than 255 characters" });

const passwordSchema = z
    .string()
    .min(1, { message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters" })
    .max(100, { message: "Password must be less than 100 characters" })
    .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, {
        message: "Password must contain at least one special character",
    });

export const loginSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
});

export const registerSchema = z
    .object({
        name: z
            .string()
            .min(1, { message: "Name is required" })
            .max(100, { message: "Name must be less than 100 characters" }),
        email: emailSchema,
        password: passwordSchema,
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
