import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();
        const user = await User.findOne({ email: credentials?.email });
        if (!user || !credentials?.password) {
          throw new Error("Invalid Email or Password");
        }
        const isValid = await user.comparePassword(credentials.password);
        if (!isValid) {
          throw new Error("Invalid Email or Password");
        }
        return { id: user._id.toString(), name: user.name, email: user.email };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/auth/error", // Add custom error page
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google") {
        await connectDB();
        let dbUser = await User.findOne({
          googleId: account.providerAccountId,
        });

        if (!dbUser) {
          // Check if email already exists with another provider
          const existingUser = await User.findOne({ email: user.email });
          if (existingUser) {
            // Prevent sign-up if email is already used
            throw new Error(
              "Email is already registered with another provider. Please sign in with that provider."
            );
          }

          // Create new user
          dbUser = new User({
            name: user.name,
            email: user.email,
            googleId: account.providerAccountId,
            picture: user.image, // Store Google profile picture (optional)
          });
          await dbUser.save();
        }
        user.id = dbUser._id.toString();
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
