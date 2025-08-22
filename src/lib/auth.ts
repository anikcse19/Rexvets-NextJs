import NextAuth from "next-auth";
import type { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { connectToDatabase } from "./mongoose";
import UserModel, { IUserModel } from "@/models/User";
import { getUserWithFullData, createOrUpdateUserAuth } from "./auth-helpers";
import { z } from "zod";
import config from "@/config/env.config";

// Input validation schemas
const signInSchema = z.object({
  email: z.string().min(1, "Email is required").regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: config.GOOGLE_CLIENT_ID!,
      clientSecret: config.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
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

          // Find user with password for authentication (single query)
          const user = await (UserModel as IUserModel).findByEmailForAuth(email);
          
          if (!user) {
            console.error("User not found:", email);
            return null;
          }

          // Check if user exists but has no password (Google OAuth user)
          if (!user.password && user.googleId) {
            console.error("Google OAuth user trying to sign in with password:", email);
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

          // Get full user data with references populated
          const fullUserData = await getUserWithFullData((user as any)._id.toString());

          // Return user data for NextAuth
          return {
            id: (user as any)._id.toString(),
            email: user.email,
            name: fullUserData?.name || user.name,
            role: user.role,
            image: fullUserData?.profileImage || user.profileImage,
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
          // Connect to database
          await connectToDatabase();
          
          // Extract data from Google profile
          const googleProfile = profile as any;
          const googleData = {
            googleId: googleProfile?.sub || account.providerAccountId,
            email: user.email,
            name: user.name,
            profileImage: user.image,
            firstName: googleProfile?.given_name || "",
            lastName: googleProfile?.family_name || "",
            locale: googleProfile?.locale || "en",
            accessToken: account.access_token,
            refreshToken: account.refresh_token,
            expiresAt: account.expires_at,
            tokenType: account.token_type,
            scope: account.scope,
          };
          
          // Check if user already exists
          const existingUser = await UserModel.findOne({ email: user.email });
          
          if (existingUser) {
            // Update existing user with Google data
            existingUser.lastLogin = new Date();
            existingUser.googleId = googleData.googleId;
            existingUser.googleAccessToken = googleData.accessToken;
            existingUser.googleRefreshToken = googleData.refreshToken;
            existingUser.googleExpiresAt = googleData.expiresAt;
            existingUser.googleTokenType = googleData.tokenType;
            existingUser.googleScope = googleData.scope;
            
            // Update profile data if not already set
            if (!existingUser.name && googleData.name) {
              existingUser.name = googleData.name;
            }
            if (!existingUser.profileImage && googleData.profileImage) {
              existingUser.profileImage = googleData.profileImage;
            }
            
            await existingUser.save();
            
            // Check if account is active
            if (!existingUser.isActive) {
              throw new Error("Account is deactivated. Please contact support.");
            }
            
            // Set session data
            user.id = (existingUser as any)._id.toString();
            user.role = existingUser.role;
            user.emailVerified = existingUser.isEmailVerified;
            user.name = existingUser.name;
            user.image = existingUser.profileImage;
            
          } else {
            // Create new user with Google OAuth
            const newUser = await createOrUpdateUserAuth(
              googleData.email,
              'pet_parent', // Default role for Google sign-up
              undefined, // No password for OAuth
              googleData
            );
            
            // Set session data for new user
            user.id = newUser._id.toString();
            user.role = newUser.role;
            user.emailVerified = true;
            user.name = newUser.name;
            user.image = newUser.profileImage;
          }
          
          return true;
        } catch (error: any) {
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
      console.log("User signed in:", user.email);
    },
    async signOut({ session, token }) {
      // Log sign out
      console.log("User signed out:", session?.user?.email);
    },
  },
  debug: process.env.NODE_ENV === "development",
};

export default NextAuth(authOptions);
