import NextAuth, { DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { z } from "zod";

import { GetManyUsers } from "@datalib/users/getUser";

declare module "next-auth" {
  interface User {
    id?: string;
    email?: string | null;
    role: string;
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      email: string;
      role: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    role: string;
  }
}

const emailSchema = z.string().email("Invalid email address.");

const passwordSchema = z
  .string()
  .min(6, { message: "Password must be at least 6 characters long." })
  .max(20, { message: "Password cannot be longer than 20 characters." });

export const { auth, handlers, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const email = credentials.email as string;
          const password = credentials.password as string;
          emailSchema.parse(email);
          passwordSchema.parse(password);

          const response = await GetManyUsers({ email });

          if (!response.ok || response.body.length === 0) {
            throw new Error(response.error ?? "User not found.");
          }

          const user = response.body[0];

          const passwordCorrect = await compare(password, user.password);
          if (!passwordCorrect) {
            throw new Error("Invalid email address or password.");
          }

          return {
            id: user._id,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          if (error instanceof z.ZodError) {
            const errorMessage = error.errors.map((e) => e.message).join(" ");
            throw new Error(errorMessage);
          }
          throw error;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // When user first logs in (Google or Credentials)
      if (user) {
        console.log("Jwt() got user:", user);
        // Try to get user data from your MongoDB
        const dbUser = await GetManyUsers({ email: user.email });
        if (dbUser.ok && dbUser.body.length > 0) {
          token.role = dbUser.body[0].role;
          token.id = dbUser.body[0]._id.toString();
        } else {
          token.role = "unknown";
        }
      }

      console.log("Final JWT token:", token);
      return token;
    },
    async session({ session, token }) {
      console.log("Session() token:", token);
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.role = token.role;
      console.log("Final session object:", session);
      return session;
    },
    async signIn({ account, profile }) {
      console.log("Account info:", account);
      console.log("Profile info:", profile);

      if (!account || !profile?.email) {
        console.log("[NextAuth] Missing account or profile", {
          account,
          profile,
        });
        return false;
      }

      if (account?.provider === "google" && profile?.email) {
        console.log("Checking MongoDB for:", profile.email);
        const response = await GetManyUsers({ email: profile.email });
        console.log("MongoDB lookup result:", response);

        if (!response.ok || response.body.length === 0) {
          console.log(
            `[NextAuth] Google login denied, user not found: ${profile.email}`
          );
          return false;
        }

        console.log(`[NextAuth] Google login allowed for: ${profile.email}`);
        return true;
      }

      return true;
    },
  },
  secret: process.env.AUTH_SECRET,
});
