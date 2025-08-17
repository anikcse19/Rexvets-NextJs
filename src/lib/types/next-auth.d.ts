// next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role: string;
    emailVerified?: boolean;
    image?: string;
    // Enhanced user data for better experience
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
    preferences?: {
      notifications: {
        email: boolean;
        sms: boolean;
        push: boolean;
      };
      language: string;
      timezone: string;
    };
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role: string;
      emailVerified?: boolean;
      image?: string;
      // Enhanced session data
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
      preferences?: {
        notifications: {
          email: boolean;
          sms: boolean;
          push: boolean;
        };
        language: string;
        timezone: string;
      };
    };
  }

  interface JWT {
    role: string;
    id: string;
    emailVerified?: boolean;
    image?: string;
    // Enhanced JWT data
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
    preferences?: {
      notifications: {
        email: boolean;
        sms: boolean;
        push: boolean;
      };
      language: string;
      timezone: string;
    };
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
