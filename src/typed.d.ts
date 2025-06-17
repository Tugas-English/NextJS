import NextAuth, { type DefaultSession } from "next-auth"

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      username: string;
      email: string;
      role: string;
      accessToken: string;
      refreshToken: string;
    };
  }
  interface User extends DefaultUser {
    id: string;
    username: string;
    email: string;
    role: string;
    accessToken: string;
    refreshToken: string;
  }
}