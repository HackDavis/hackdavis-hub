import { handlers } from '@/auth';

export const authOptions = {
    providers: [
      // Your authentication providers (e.g., Google, GitHub)
    ],
    secret: process.env.NEXTAUTH_SECRET, // Add this
  };

export const { GET, POST } = handlers;
