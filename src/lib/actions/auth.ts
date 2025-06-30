'use server';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import { db } from '@/db';
import { user } from '@/db/schema';
import { registerSchema } from '../schemas/auth';
import { nanoid } from 'nanoid';

export async function RegisterAction({
  email,
  name,
  password,
  confirmPassword,
}: {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
}) {
  const validatedFields = registerSchema.safeParse({
    name,
    email,
    password,
    confirmPassword,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please fix the errors above.',
    };
  }

  try {
    // Check if user already exists
    const existingUser = await db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return {
        errors: {
          email: ['This email is already registered'],
        },
        message: 'Email already exists.',
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    await db
      .insert(user)
      .values({
        id: nanoid(),
        email,
        name,
        password: hashedPassword,
        provider: 'credentials',
        role: 'student',
        emailVerified: false,
        isActive: true,
      })
      .returning();

    return {
      success: true,
      message: 'Account created successfully! You can now sign in.',
    };
  } catch (error) {
    return {
      user: null,
      error: error instanceof Error ? error.message : 'Registration failed',
    };
  }
}

export async function getUserByEmail(email: string) {
  const getUser = await db
    .select()
    .from(user)
    .where(eq(user.email, email))
    .limit(1)
    .execute();

  return getUser || null;
}
