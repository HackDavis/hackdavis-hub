import NextAuth, { DefaultSession } from 'next-auth';
import 'next-auth/jwt';
import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { GetManyJudges } from '@datalib/judges/getJudge';

declare module 'next-auth' {
  interface User {
    role: string;
  }

  interface Session extends DefaultSession {
    user: {
      role: string;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: string;
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/',
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const data = await GetManyJudges({
            email: credentials.email as string,
          });

          if (!data.body || data.body.length !== 1) {
            return null;
          }

          const judge = data.body[0];

          const passwordCorrect = await compare(
            credentials.password as string,
            judge.password
          );

          if (passwordCorrect) {
            return {
              id: judge._id,
              email: judge.email,
              role: judge.role,
            };
          }

          return null;
        } catch (e) {
          console.error('Auth error: ', e);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      return session;
    },
  },
});
