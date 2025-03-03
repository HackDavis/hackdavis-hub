import NextAuth, { DefaultSession } from 'next-auth';
import 'next-auth/jwt';
import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { z } from 'zod';

import { GetManyUsers } from '@datalib/users/getUser';

declare module 'next-auth' {
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
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    role: string;
  }
}

const emailSchema = z.string().email('Invalid email address.');

const passwordSchema = z
  .string()
  .min(6, { message: 'Password must be at least 6 characters long.' })
  .max(20, { message: 'Password cannot be longer than 20 characters.' });

export const { auth, handlers, signIn, signOut } = NextAuth({
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const email = credentials.email as string;
          const password = credentials.password as string;
          emailSchema.parse(email);
          passwordSchema.parse(password);

          const response = await GetManyUsers({ email });

          if (!response.body || response.body.length === 0) {
            throw new Error('Internal server error');
          }

          const user = response.body[0];

          const passwordCorrect = await compare(password, user.password);
          if (!passwordCorrect) {
            throw new Error('Invalid email address or password.');
          }

          return {
            id: user._id,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          if (error instanceof z.ZodError) {
            const errorMessage = error.errors.map((e) => e.message).join(' ');
            throw new Error(errorMessage);
          }
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id ?? 'User ID not found';
        token.email = user.email ?? 'User email not found';
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.role = token.role;
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
});
