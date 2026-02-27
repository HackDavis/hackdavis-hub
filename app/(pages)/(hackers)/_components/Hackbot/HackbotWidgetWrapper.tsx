'use client';

import { useSession } from 'next-auth/react';
import HackbotWidget from './HackbotWidget';

export default function HackbotWidgetWrapper() {
  const { data: session, status } = useSession();

  if (status === 'loading' || !session) return null;

  const role = (session.user as any)?.role;
  if (role !== 'hacker' && role !== 'admin') return null;

  return <HackbotWidget />;
}
