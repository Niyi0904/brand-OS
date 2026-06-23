import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

// Edge-compatible auth config — NO PrismaAdapter, NO bcrypt imports
// This is used exclusively in middleware.ts which runs on Edge Runtime
export const { auth } = NextAuth({
  session: {
    strategy: "jwt",
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
      async authorize() {
        // Edge middleware never authorizes — only validates sessions
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ token, session }: any) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.picture as string;
        session.user.onboardingCompleted = token.onboardingCompleted ?? false;
        session.user.onboardingStep = token.onboardingStep ?? "brand";
      }
      return session;
    },
    async jwt({ token, user, trigger, session }: any) {
      if (user) {
        token.id = user.id;
      }
      if (trigger === "update") {
        if (session?.onboardingCompleted !== undefined) {
          token.onboardingCompleted = session.onboardingCompleted;
        }
        if (session?.onboardingStep !== undefined) {
          token.onboardingStep = session.onboardingStep;
        }
      }
      return token;
    },
  },
});