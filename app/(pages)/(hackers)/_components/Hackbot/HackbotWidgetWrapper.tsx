'use client';

import { useSession } from 'next-auth/react';
import HackbotWidget from './HackbotWidget';
import { HackerProfile } from '@actions/hackbot/getHackerProfile';

export default function HackbotWidgetWrapper({
  initialProfile,
}: {
  initialProfile: HackerProfile | null;
}) {
  const { data: session, status } = useSession();

  if (status === 'loading' || !session) return null;

  const role = (session.user as any)?.role;
  if (role !== 'hacker' && role !== 'admin') return null;

  return (
    <HackbotWidget
      userId={String((session.user as any)?.id ?? '')}
      initialProfile={initialProfile}
    />
  );
}
