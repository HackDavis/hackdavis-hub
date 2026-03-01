import { auth } from '@/auth';
import HackbotWidgetWrapper from './_components/Hackbot/HackbotWidgetWrapper';
import type { HackerProfile } from '@typeDefs/hackbot';

export default async function HackersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const u = session?.user as any;
  const profile: HackerProfile | null = u
    ? {
        name: u.name ?? undefined,
        position: u.position ?? undefined,
        is_beginner: u.is_beginner ?? undefined,
      }
    : null;

  return (
    <>
      {children}
      <HackbotWidgetWrapper initialProfile={profile} />
    </>
  );
}
