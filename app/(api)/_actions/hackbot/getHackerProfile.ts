'use server';

import { auth } from '@/auth';
import type { HackerProfile } from '@typeDefs/hackbot';

export type { HackerProfile };

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
