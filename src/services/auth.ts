import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { db } from "@/db";
import { users } from "@/db/schema";

export async function registerWithCredentials({
    email,
    name,
    password,
}: {
    email: string;
    name: string;
    password: string;
}) {
    try {
        // Check if user already exists
        const existingUser = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .execute();

        if (existingUser.length > 0) {
            throw new Error("Email already in use");
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const [newUser] = await db
            .insert(users)
            .values({
                email,
                name,
                password: hashedPassword,
                provider: "credentials",
                role: "student", // default role
            })
            .returning();

        return { user: newUser, error: null };
    } catch (error) {
        return {
            user: null,
            error:
                error instanceof Error ? error.message : "Registration failed",
        };
    }
}

export async function loginWithCredentials({
    email,
    password,
}: {
    email: string;
    password: string;
}) {
    try {
        // Find user by email
        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1)
            .execute();

        if (!user) {
            throw new Error("Invalid email or password");
        }

        // Check password
        const passwordMatch = await bcrypt.compare(
            password,
            user.password || ""
        );

        if (!passwordMatch) {
            throw new Error("Invalid email or password");
        }

        // Check if user is active
        if (!user.isActive) {
            throw new Error("Account is inactive");
        }

        return { user, error: null };
    } catch (error) {
        return {
            user: null,
            error: error instanceof Error ? error.message : "Login failed",
        };
    }
}

export async function handleGoogleAuth({
    email,
    name,
    avatarUrl,
}: {
    email: string;
    name: string;
    avatarUrl?: string | null;
}) {
    try {
        // Check if user exists by googleId
        const [existingUser] = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1)
            .execute();

        if (existingUser) {
            return { user: existingUser, error: null };
        }

        // Check if email already exists (but with different provider)
        const [userWithEmail] = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1)
            .execute();

        if (userWithEmail) {
            // Merge accounts if email exists but different provider
            if (userWithEmail.provider !== "google") {
                await db
                    .update(users)
                    .set({
                        provider: "both",
                        avatarUrl: avatarUrl || userWithEmail.avatarUrl,
                    })
                    .where(eq(users.id, userWithEmail.id))
                    .execute();

                const [updatedUser] = await db
                    .select()
                    .from(users)
                    .where(eq(users.id, userWithEmail.id))
                    .limit(1)
                    .execute();

                return { user: updatedUser, error: null };
            }
        }

        // Create new user
        const [newUser] = await db
            .insert(users)
            .values({
                email,
                name,
                provider: "google",
                avatarUrl,
                role: "student", // default role
                isActive: true,
                emailVerified: new Date(),
            })
            .returning();

        return { user: newUser, error: null };
    } catch (error) {
        return {
            user: null,
            error:
                error instanceof Error ? error.message : "Google auth failed",
        };
    }
}

export async function getUserByEmail(email: string) {
    const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1)
        .execute();

    return user || null;
}
