import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./db";
import { compare } from "bcryptjs";
import { signInSchema } from "./validations";

export const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(prisma) as any,
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
    newUser: "/auth/signup",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.error("[AUTH DEBUG MISSING CREDENTIALS] Missing email or password");
          throw new Error("Invalid credentials");
        }

        const validatedFields = signInSchema.safeParse(credentials);
        if (!validatedFields.success) {
          console.error("[AUTH DEBUG ZOD VALIDATION] Validation failed:", validatedFields.error.flatten().fieldErrors);
          throw new Error("Invalid credentials");
        }

        const email = validatedFields.data.email as string;
        const password = validatedFields.data.password as string;
        console.error("[AUTH DEBUG ATTEMPT LOGIN] Attempting login for email:", email, "password length:", password.length);

        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        console.error("[AUTH DEBUG] User found:", !!user, "has password:", !!user?.password);

        if (!user || !user.password) {
          console.error("[AUTH DEBUG] User not found or no password");
          throw new Error("Invalid credentials");
        }

        const passwordMatch = await compare(password, user.password);
        console.error("[AUTH DEBUG] Password match:", passwordMatch);
        if (!passwordMatch) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user.id,
          name: user.name ?? "",
          email: user.email,
          image: user.image ?? "",
        } as any;
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.picture as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  events: {
    async createUser({ user }) {
      // Create a default organization for new users
      await prisma.organization.create({
        data: {
          name: `${user.name}'s Organization`,
          slug: `${user.name?.toLowerCase().replace(/\s+/g, "-")}-${user.id.slice(0, 8)}`,
          members: {
            create: {
              userId: user.id,
              role: "OWNER",
            },
          },
        },
      });
    },
  },
};

export const { handlers, auth } = NextAuth(authOptions);