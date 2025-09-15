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
  trustHost: true,
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
          role: "pet_parent",
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
          const validatedFields = signInSchema.safeParse(credentials);
          if (!validatedFields.success) {
            console.error("Validation error:", validatedFields.error);
            return null;
          }

          const { email, password } = validatedFields.data;
          await connectToDatabase();

          const user = await (UserModel as IUserModel).findByEmailForAuth(
            email
          );
          if (!user) return null;

          if (!user.password && user.googleId) return null;
          if (user.checkIfLocked()) {
            throw new Error(
              "Account is temporarily locked due to too many failed login attempts."
            );
          }
          if (!user.isActive) {
            throw new Error("Account is deactivated. Please contact support.");
          }

          const isPasswordValid = await user.comparePassword(password);
          if (!isPasswordValid) {
            await user.incrementLoginAttempts();
            return null;
          }
          if (!user.isEmailVerified) {
            throw new Error("EmailNotVerified");
          }

          await user.resetLoginAttempts();
          const fullUserData = await getUserWithFullData(
            (user as any)._id.toString()
          );

          return {
            id: (user as any)._id.toString(),
            email: (user as any).email,
            name: fullUserData?.name || (user as any).name,
            image: fullUserData?.profileImage || (user as any).profileImage,
            role: (user as any).role,
            timezone: (user as any)?.timezone,
            accesslist: (user as any)?.accesslist,
            refId:
              (user as any).role === "pet_parent"
                ? (user as any).petParentRef?.toString()
                : (user as any).role === "veterinarian"
                ? (user as any).veterinarianRef?.toString()
                : (user as any).role === "vetTech"
                ? (user as any).vetTechRef?.toString()
                : (user as any).role === "moderator"
                ? (user as any)._id?.toString()
                : (user as any).adminRef?.toString(),
          } as any;
        } catch (error) {
          console.error("Authentication error:", error);
          throw error;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60,
  },
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.session-token"
          : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        ...(process.env.NODE_ENV === "production"
          ? { domain: ".rexvet.org" }
          : {}),
        maxAge: 30 * 24 * 60 * 60,
      },
    },
    callbackUrl: {
      name: "next-auth.callback-url",
      options: {
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        ...(process.env.NODE_ENV === "production"
          ? { domain: ".rexvet.org" }
          : {}),
      },
    },
    csrfToken: {
      name: "next-auth.csrf-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        ...(process.env.NODE_ENV === "production"
          ? { domain: ".rexvet.org" }
          : {}),
      },
    },
  },
  callbacks: {
    async jwt({ token, user, account, trigger }: any) {
      if (account && user) {
        token.role = user.role;
        token.id = user.id;
        token.emailVerified = Boolean(user.emailVerified);
        token.image = user.image;
        token.refId = user.refId;
        token.timezone = user.timezone;
        token.accesslist = user.accesslist;
        token.iat = Math.floor(Date.now() / 1000);
        token.exp = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
      } else if (trigger === "update" && user) {
        token.role = user.role || token.role;
        token.emailVerified = Boolean(
          user.emailVerified ?? token.emailVerified
        );
        token.image = user.image || token.image;
        token.refId = user.refId || token.refId;
        token.timezone = user.timezone || token.timezone;
        token.accesslist = user.accesslist || token.accesslist;
      }

      const now = Math.floor(Date.now() / 1000);
      if (token.exp && now > token.exp) return null;

      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          role: token.role as string,
          emailVerified: Boolean(token.emailVerified),
          image: token.image as string,
          refId: token.refId as string,
          timezone: token.timezone as string,
          accesslist: (token.accesslist as string[]) || [],
        };
        session.expires = new Date(token.exp * 1000).toISOString();
      }
      return session;
    },
    async signIn({ user, account, profile }: any) {
      if (account?.provider === "google") {
        try {
          await connectToDatabase();
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

          const existingUser = await UserModel.findOne({ email: user.email });
          if (existingUser) {
            existingUser.lastLogin = new Date();
            existingUser.googleId = googleData.googleId;
            existingUser.googleAccessToken = googleData.accessToken;
            existingUser.googleRefreshToken = googleData.refreshToken;
            existingUser.googleExpiresAt = googleData.expiresAt;
            existingUser.googleTokenType = googleData.tokenType;
            existingUser.googleScope = googleData.scope;

            if (!existingUser.name && googleData.name) {
              existingUser.name = googleData.name;
            }
            if (!existingUser.profileImage && googleData.profileImage) {
              existingUser.profileImage = googleData.profileImage;
            }

            await existingUser.save();

            if (!existingUser.isActive) {
              throw new Error(
                "Account is deactivated. Please contact support."
              );
            }

            user.id = (existingUser as any)._id.toString();
            user.role = existingUser.role;
            user.emailVerified = existingUser.isEmailVerified;
            user.name = existingUser.name;
            user.image = existingUser.profileImage;
            user.timezone = existingUser?.timezone;
            user.accesslist = existingUser?.accesslist;
            if (
              existingUser.role === "veterinarian" &&
              existingUser.veterinarianRef
            ) {
              user.veterinarianRef = existingUser.veterinarianRef.toString();
            }
            user.refId =
              existingUser.role === "pet_parent"
                ? existingUser.petParentRef?.toString()
                : existingUser.role === "admin"
                ? existingUser.adminRef?.toString()
                : existingUser.role === "veterinarian"
                ? existingUser.veterinarianRef?.toString()
                : existingUser.role === "moderator"
                ? existingUser._id?.toString()
                : existingUser.vetTechRef?.toString();
          } else {
            console.error("Google OAuth sign-up blocked:", user.email);
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
      console.log("User signed in:", user.email);
    },
    async signOut({ session }: any) {
      console.log("User signed out:", session?.user?.email);
    },
  },
  debug: process.env.NODE_ENV === "development",
};
