// src/types/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    role: string;
    refId?: string;
    emailVerified?: boolean;
    phoneNumber?: string;
    state?: string;
    city?: string;
    address?: string;
    zipCode?: string;
    firstName?: string;
    lastName?: string;
    locale?: string;
    isApproved?: boolean;
    specialization?: string;
    licenseNumber?: string;
    consultationFee?: number;
    available?: boolean;
    pets?: any[];
    emergencyContact?: {
      name: string;
      phone: string;
      relationship: string;
    };
    timezone?: string;
  }

  interface Session {
    user: User & DefaultSession["user"]; // ✅ reuse User here
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: string;
    refId?: string;
    emailVerified?: boolean;
    phoneNumber?: string;
    state?: string;
    city?: string;
    address?: string;
    zipCode?: string;
    firstName?: string;
    lastName?: string;
    locale?: string;
    isApproved?: boolean;
    specialization?: string;
    licenseNumber?: string;
    consultationFee?: number;
    available?: boolean;
    pets?: any[];
    emergencyContact?: {
      name: string;
      phone: string;
      relationship: string;
    };
    timezone?: string;
  }
}
