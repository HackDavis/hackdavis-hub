'use server';

import { auth } from '@/auth';

export type HackerProfile = {
  name?: string;
  position?: string;
  is_beginner?: boolean;
};

export async function getHackerProfile(): Promise<HackerProfile | null> {
  const session = await auth();
  if (!session?.user) return null;
  const user = session.user as any;
  return {
    name: user.name ?? undefined,
    position: user.position ?? undefined,
    is_beginner: user.is_beginner ?? undefined,
  };
}
