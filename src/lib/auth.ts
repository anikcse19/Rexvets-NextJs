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

          // Check if user exists but has no password (Google OAuth user)
          if (!user.password && user.googleId) {
            console.error("Google OAuth user trying to sign in with password:", email);
            // Return null but we'll handle this case in the signin page
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
        
        // Enhanced user data
        token.phoneNumber = user.phoneNumber;
        token.state = user.state;
        token.city = user.city;
        token.address = user.address;
        token.zipCode = user.zipCode;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.locale = user.locale;
        token.isApproved = user.isApproved;
        token.specialization = user.specialization;
        token.licenseNumber = user.licenseNumber;
        token.consultationFee = user.consultationFee;
        token.available = user.available;
        token.pets = user.pets;
        token.emergencyContact = user.emergencyContact;
        token.preferences = user.preferences;
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
          // Enhanced session data
          phoneNumber: token.phoneNumber as string,
          state: token.state as string,
          city: token.city as string,
          address: token.address as string,
          zipCode: token.zipCode as string,
          firstName: token.firstName as string,
          lastName: token.lastName as string,
          locale: token.locale as string,
          isApproved: token.isApproved as boolean,
          specialization: token.specialization as string,
          licenseNumber: token.licenseNumber as string,
          consultationFee: token.consultationFee as number,
          available: token.available as boolean,
          pets: token.pets as any[],
          emergencyContact: token.emergencyContact as any,
          preferences: token.preferences as any,
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
          
          // Extract comprehensive data from Google profile
          const googleProfile = profile as any;
          const googleData = {
            googleId: googleProfile?.sub || account.providerAccountId,
            email: user.email,
            name: user.name,
            profileImage: user.image,
            firstName: googleProfile?.given_name || "",
            lastName: googleProfile?.family_name || "",
            locale: googleProfile?.locale || "en",
            emailVerified: googleProfile?.email_verified || true,
            picture: googleProfile?.picture || user.image,
            hd: googleProfile?.hd || "", // Hosted domain
            accessToken: account.access_token,
            refreshToken: account.refresh_token,
            expiresAt: account.expires_at,
            tokenType: account.token_type,
            scope: account.scope,
          };
          
          // Check if user already exists in any collection
          
          // Check all collections to prevent duplicate accounts
          const petParentUser = await PetParentModel.findOne({ email: user.email });
          const veterinarianUser = await VeterinarianModel.findOne({ email: user.email });
          const vetTechUser = await VetTechModel.findOne({ email: user.email });
          
          // Count how many accounts exist with this email
          const existingAccounts = [petParentUser, veterinarianUser, vetTechUser].filter(Boolean);
          
          if (existingAccounts.length > 1) {
            throw new Error("This email is already associated with another account type. Please use a different email or contact support.");
          }
          
          // Determine which account exists (if any)
          const existingUser = petParentUser || veterinarianUser || vetTechUser;
          let userRole = 'pet_parent';
          
          if (veterinarianUser) {
            userRole = 'veterinarian';
          } else if (vetTechUser) {
            userRole = 'technician';
          }
          

          
          if (existingUser) {
            // EXISTING USER: Update with latest Google data and load all existing data

            
            // Update Google OAuth data (preserve existing profile data)
            existingUser.lastLogin = new Date();
            existingUser.googleId = googleData.googleId;
            existingUser.googleAccessToken = googleData.accessToken;
            existingUser.googleRefreshToken = googleData.refreshToken;
            existingUser.googleExpiresAt = googleData.expiresAt;
            existingUser.googleTokenType = googleData.tokenType;
            existingUser.googleScope = googleData.scope;
            
            // Only update profile data if not already set (preserve existing data)
            if (!existingUser.profileImage && googleData.profileImage) {
              existingUser.profileImage = googleData.profileImage;
            }
            if (!existingUser.firstName && googleData.firstName) {
              existingUser.firstName = googleData.firstName;
            }
            if (!existingUser.lastName && googleData.lastName) {
              existingUser.lastName = googleData.lastName;
            }
            if (!existingUser.locale) {
              existingUser.locale = googleData.locale;
            }
            
            await existingUser.save();
            
            // Check if account is active
            if (!existingUser.isActive) {
              throw new Error("Account is deactivated. Please contact support.");
            }
            
            // Load all existing data into the session
            user.id = existingUser._id.toString();
            user.role = userRole;
            user.emailVerified = existingUser.isEmailVerified;
            user.name = existingUser.name;
            user.image = existingUser.profileImage;
            
            // Add additional user data for enhanced experience (safely)
            if (existingUser.phoneNumber) user.phoneNumber = existingUser.phoneNumber;
            if (existingUser.state) user.state = existingUser.state;
            if (existingUser.city) user.city = existingUser.city;
            if (existingUser.address) user.address = existingUser.address;
            if (existingUser.zipCode) user.zipCode = existingUser.zipCode;
            if (existingUser.firstName) user.firstName = existingUser.firstName;
            if (existingUser.lastName) user.lastName = existingUser.lastName;
            if (existingUser.locale) user.locale = existingUser.locale;
            
            // Add role-specific data safely
            if (userRole === 'veterinarian') {
              const vetUser = existingUser as any;
              if (vetUser.isApproved !== undefined) user.isApproved = vetUser.isApproved;
              if (vetUser.specialization) user.specialization = vetUser.specialization;
              if (vetUser.licenseNumber) user.licenseNumber = vetUser.licenseNumber;
              if (vetUser.consultationFee) user.consultationFee = vetUser.consultationFee;
              if (vetUser.available !== undefined) user.available = vetUser.available;
            }
            
            // Add common data safely
            const anyUser = existingUser as any;
            if (anyUser.pets) user.pets = anyUser.pets;
            if (anyUser.emergencyContact) user.emergencyContact = anyUser.emergencyContact;
            if (anyUser.preferences) user.preferences = anyUser.preferences;
            

            
          } else {
            // NEW USER: Create new account in database
            
            try {
              // Create new PetParent user (default role for Google sign-up)
              const newUser = new PetParentModel({
                name: googleData.name,
                email: googleData.email,
                profileImage: googleData.profileImage,
                isEmailVerified: true, // Google emails are pre-verified
                lastLogin: new Date(),
                
                // Google OAuth data
                googleId: googleData.googleId,
                googleAccessToken: googleData.accessToken,
                googleRefreshToken: googleData.refreshToken,
                googleExpiresAt: googleData.expiresAt,
                googleTokenType: googleData.tokenType,
                googleScope: googleData.scope,
                
                // Profile data from Google
                firstName: googleData.firstName,
                lastName: googleData.lastName,
                locale: googleData.locale,
                
                // Required fields (empty for now, will be filled in profile completion)
                phoneNumber: "",
                state: "",
                
                // Default preferences
                preferences: {
                  notifications: {
                    email: true,
                    sms: true,
                    push: true
                  },
                  language: googleData.locale || 'en',
                  timezone: 'UTC'
                },
                
                // Initialize empty arrays/objects
                pets: [],
                emergencyContact: {
                  name: "",
                  phone: "",
                  relationship: ""
                },
                fcmTokens: {}
              });
              
              await newUser.save();
              
              // Set basic session data for new user
              user.id = newUser._id.toString();
              user.role = 'pet_parent';
              user.emailVerified = true;
              user.name = newUser.name;
              user.image = newUser.profileImage;
              

              
            } catch (createError: any) {
              throw new Error(`Failed to create new user: ${createError?.message}`);
            }
          }
          
          return true;
        } catch (error: any) {
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
      
    },
    async signOut({ session, token }) {
      // Log sign out
      
    },
  },
  debug: process.env.NODE_ENV === "development",
};

export default NextAuth(authOptions);
