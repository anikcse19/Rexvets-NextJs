// next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role: string;
    emailVerified?: boolean;
    image?: string;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role: string;
      emailVerified?: boolean;
      image?: string;
    };
  }

  interface JWT {
    role: string;
    id: string;
    emailVerified?: boolean;
    image?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    id: string;
    emailVerified?: boolean;
    image?: string;
  }
}
