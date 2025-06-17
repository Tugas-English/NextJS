import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import authConfig from "./auth.config";
import { db } from "./db";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

export const { auth, handlers, signIn, signOut } = NextAuth({
    ...authConfig,
    secret: process.env.AUTH_SECRET,
    pages: {
        signIn: "/auth/login",
        signOut: "/auth/login",
    },
    providers: [
        Credentials({
            type: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                try {
                    if (!credentials?.email || !credentials?.password) {
                        throw new Error("Email and password are required");
                    }

                    const [user] = await db
                        .select()
                        .from(users)
                        .where(eq(users.email, credentials.email))
                        .limit(1);

                    if (!user?.password) {
                        throw new Error("User not found or no password set");
                    }

                    const isValidPassword = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );

                    if (!isValidPassword) {
                        throw new Error("Invalid password");
                    }

                    return {
                        id: user.id.toString(),
                        email: user.email,
                        name: user.name,
                        role: user.role,
                        image: user.avatarUrl,
                    };
                } catch (error) {
                    console.error("Authorization error:", error);
                    return null;
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
});