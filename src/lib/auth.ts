import config from "@/config/env.config";
import UserModel, { IUserModel } from "@/models/User";
import type { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { z } from "zod";
import { createOrUpdateUserAuth, getUserWithFullData } from "./auth-helpers";
import { connectToDatabase } from "./mongoose";

// Input validation schemas
const signInSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: config.GOOGLE_CLIENT_ID!,
      clientSecret: config.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile",
        },
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: "pet_parent", // Default role for Google OAuth users
        };
      },
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
          const user = await (UserModel as IUserModel).findByEmailForAuth(
            email
          );

          if (!user) {
            console.error("User not found:", email);
            return null;
          }

          // Check if user exists but has no password (Google OAuth user)
          if (!user.password && user.googleId) {
            console.error(
              "Google OAuth user trying to sign in with password:",
              email
            );
            return null;
          }

          // Check if account is locked
          if (user.checkIfLocked()) {
            console.error("Account is locked:", email);
            throw new Error(
              "Account is temporarily locked due to too many failed login attempts. Please try again later."
            );
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
          const fullUserData = await getUserWithFullData(
            (user as any)._id.toString()
          );

          // Return user data for NextAuth
          return {
            id: (user as any)._id.toString(),
            email: (user as any).email,
            name: fullUserData?.name || (user as any).name,
            image: fullUserData?.profileImage || (user as any).profileImage,
            role: (user as any).role,
            timezone: (user as any)?.timezone,
            refId:
              (user as any).role === "pet_parent"
                ? (user as any).petParentRef?.toString()
                : (user as any).role === "veterinarian"
                ? (user as any).veterinarianRef?.toString()
                : (user as any).vetTechRef?.toString(),
          } as any;
        } catch (error) {
          console.error("Authentication error:", error);

          // Handle specific database connection errors
          if (
            error instanceof Error &&
            error.message.includes("ECONNREFUSED")
          ) {
            throw new Error(
              "Database connection failed. Please try again later."
            );
          }

          throw error;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 60 * 60, // 1 hour
  },
  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user, account }: any) {
      // Initial sign in
      if (account && user) {
        token.role = user.role;
        token.id = user.id;
        token.emailVerified = Boolean(user.emailVerified);
        token.image = user.image;
        token.refId = user.refId;
        token.timezone = user.timezone;

        // Console log the JWT token data on initial sign in
        console.log("🔑 JWT Token Data (Initial Sign In):", {
          role: token.role,
          id: token.id,
          emailVerified: token.emailVerified,
          image: token.image,
          refId: token.refId,
          timezone: token.timezone,
        });
      } else {
        // Console log the JWT token data on subsequent calls
        console.log("🔑 JWT Token Data (Subsequent):", {
          role: token.role,
          id: token.id,
          emailVerified: token.emailVerified,
          image: token.image,
          refId: token.refId,
          timezone: token.timezone,
        });
      }

      // Return previous token if the access token has not expired yet
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          role: token.role as string,
          emailVerified: token.emailVerified as boolean,
          image: token.image as string,
          refId: token.refId as string,
          timezone: token.timezone as string,
        };
      }

      // Console log the session data
      console.log("🔍 Session Data:", {
        user: session.user,
        expires: session.expires
      });

      return session;
    },
    async signIn({ user, account, profile }: any) {
      // Handle Google OAuth sign in
      if (account?.provider === "google") {
        try {
          // Connect to database
          await connectToDatabase();

          // Extract data from Google profile
          const googleProfile = profile as any;
          const googleData = {
            googleId: googleProfile?.sub || account.providerAccountId,
            email: user.email || "",
            name: user.name || "",
            profileImage: user.image || "",
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
              throw new Error(
                "Account is deactivated. Please contact support."
              );
            }

            // Set session data
            user.id = (existingUser as any)._id.toString();
            user.role = existingUser.role;
            user.emailVerified = existingUser.isEmailVerified;
            user.name = existingUser.name;
            user.image = existingUser.profileImage;
            user.timezone = existingUser?.timezone;

            // Add reference to veterinarian profile if user is a veterinarian
            if (
              existingUser.role === "veterinarian" &&
              existingUser.veterinarianRef
            ) {
              user.veterinarianRef = existingUser.veterinarianRef.toString();
            }
            user.refId =
              existingUser.role === "pet_parent"
                ? existingUser.petParentRef?.toString()
                : existingUser.role === "veterinarian"
                ? existingUser.veterinarianRef?.toString()
                : existingUser.vetTechRef?.toString();
          } else {
            // Prevent new user creation through Google OAuth
            // Users must register through the proper signup process
            console.error("Google OAuth sign-up blocked for new users:", user.email);
            // Return false to trigger error redirect, NextAuth will use "AccessDenied" by default
            // We'll handle this specific case in the error page
            return false;
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
    async signIn({ user }: any) {
      // Log successful sign in
      console.log("User signed in:", user.email);
    },
    async signOut({ session }: any) {
      // Log sign out
      console.log("User signed out:", session?.user?.email);
    },
  },
  debug: false,
};

// export default NextAuth(authOptions);
