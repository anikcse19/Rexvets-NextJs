import NextAuth from "next-auth";
import type { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { connectToDatabase } from "./mongoose";
import PetParentModel, { IPetParentModel } from "@/models/PetParent";
import VeterinarianModel, { IVeterinarianModel } from "@/models/Veterinarian";
import VetTechModel, { IVetTechModel } from "@/models/VetTech";
import { z } from "zod";
import config from "@/config/env.config";

// Input validation schemas
const signInSchema = z.object({
  email: z.string().min(1, "Email is required").regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name cannot exceed 50 characters"),
  email: z.string().min(1, "Email is required").regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["pet_parent", "veterinarian", "technician"]),
  phoneNumber: z.string().optional(),
  specialization: z.string().optional(),
  licenseNumber: z.string().optional(),
  consultationFee: z.number().min(0).optional(),
});

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: config.GOOGLE_CLIENT_ID!,
      clientSecret: config.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        try {
          // Validate input
          const validatedFields = signInSchema.safeParse(credentials);
          if (!validatedFields.success) {
            console.error("Validation error:", validatedFields.error);
            return null;
          }

          const { email, password } = validatedFields.data;

          // Connect to database
          await connectToDatabase();

          // Find user with password for authentication
          // Try to find in PetParent collection first
          let user: any = await (PetParentModel as IPetParentModel).findByEmailForAuth(email);
          let userRole = 'pet_parent';
          
          if (!user) {
            // Try Veterinarian collection
            user = await (VeterinarianModel as IVeterinarianModel).findByEmailForAuth(email);
            userRole = 'veterinarian';
          }
          
          if (!user) {
            // Try VetTech collection
            user = await (VetTechModel as IVetTechModel).findByEmailForAuth(email);
            userRole = 'technician';
          }
          if (!user) {
            console.error("User not found:", email);
            // Return null for invalid credentials (NextAuth will handle this as CredentialsSignin error)
            return null;
          }

          // Check if account is locked
          if (user.checkIfLocked()) {
            console.error("Account is locked:", email);
            throw new Error("Account is temporarily locked due to too many failed login attempts. Please try again later.");
          }

          // Check if account is active
          if (!user.isActive) {
            console.error("Account is inactive:", email);
            throw new Error("Account is deactivated. Please contact support.");
          }

          // Verify password
          const isPasswordValid = await user.comparePassword(password);
          if (!isPasswordValid) {
            // Increment login attempts
            await user.incrementLoginAttempts();
            console.error("Invalid password for user:", email);
            return null;
          }

          // Check if email is verified
          if (!user.isEmailVerified) {
            console.warn("Email not verified for user:", email);
            throw new Error("EmailNotVerified");
          }

          // Reset login attempts on successful login
          await user.resetLoginAttempts();

          // Return user data for NextAuth
          return {
            id: (user as any)._id.toString(),
            email: user.email,
            name: user.name,
            role: userRole,
            image: user.profileImage,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          
          // Handle specific database connection errors
          if (error instanceof Error && error.message.includes("ECONNREFUSED")) {
            throw new Error("Database connection failed. Please try again later.");
          }
          
          throw error;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 60 * 60, // 1 hour
  },
  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        token.role = user.role;
        token.id = user.id;
        token.emailVerified = Boolean(user.emailVerified);
        token.image = user.image;
      }

      // Return previous token if the access token has not expired yet
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          role: token.role as string,
          emailVerified: token.emailVerified as boolean,
          image: token.image as string,
        };
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      // Handle Google OAuth sign in
      if (account?.provider === "google") {
        try {
          await connectToDatabase();
          
          // Check if user already exists in any collection
          let existingUser = await PetParentModel.findOne({ email: user.email });
          
          if (!existingUser) {
            existingUser = await VeterinarianModel.findOne({ email: user.email });
          }
          
          if (!existingUser) {
            existingUser = await VetTechModel.findOne({ email: user.email });
          }
          
          if (existingUser) {
            // Update last login
            existingUser.lastLogin = new Date();
            await existingUser.save();
            
            // Check if account is active
            if (!existingUser.isActive) {
              throw new Error("Account is deactivated. Please contact support.");
            }
          } else {
            // Create new user from Google OAuth (default to pet parent)
            const newUser = new PetParentModel({
              name: user.name,
              email: user.email,
              profileImage: user.image,
              isEmailVerified: true, // Google emails are pre-verified
              lastLogin: new Date(),
              phoneNumber: "", // Will be required to fill later
              state: "", // Will be required to fill later
            });
            
            await newUser.save();
          }
          
          return true;
        } catch (error) {
          console.error("Google OAuth error:", error);
          return false;
        }
      }
      
      return true;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      // Log successful sign in
      console.log(`User signed in: ${user.email} via ${account?.provider}`);
    },
    async signOut({ session, token }) {
      // Log sign out
      console.log(`User signed out: ${session?.user?.email}`);
    },
  },
  debug: process.env.NODE_ENV === "development",
};

export default NextAuth(authOptions);
