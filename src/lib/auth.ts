import NextAuth from "next-auth";
import type { NextAuthConfig, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        const email = credentials?.email ? String(credentials.email) : "";
        const password = credentials?.password
          ? String(credentials.password)
          : "";

        if (!email || !password) {
          return null;
        }

        // This MUST always return a complete User object
        const user: User & { role: string } = {
          id: "1", // guaranteed string
          email, // guaranteed string
          name: "User", // guaranteed string
          role: "pet_parent",
        };

        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.sub ?? "", // ensure string
          role: (token as any).role ?? "",
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    // signUp: "/auth/signup",
  },
};

export default NextAuth(authOptions);
