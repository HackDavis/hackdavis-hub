import NextAuth, { DefaultSession } from 'next-auth';
import 'next-auth/jwt';
import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { z } from 'zod';

import { GetManyUsers } from '@datalib/users/getUser';

declare module 'next-auth' {
  interface User {
    id?: string | undefined;
    role: string;
  }

  interface Session extends DefaultSession {
    user: {
      id: string | undefined;
      role: string;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
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

          const data = await GetManyUsers({ email });

          if (!data.body || data.body.length !== 1) {
            throw new Error('Internal server error');
          }

          const user = data.body[0];

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
        token.id = user.id ?? '';
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
});
