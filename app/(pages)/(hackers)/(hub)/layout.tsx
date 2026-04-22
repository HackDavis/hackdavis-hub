import { auth } from '@/auth';
import ProtectedDisplay from '@components/ProtectedDisplay/ProtectedDisplay';
import Navbar from '@components/Navbar/Navbar';
import HackbotWidgetWrapper from '../_components/Hackbot/HackbotWidgetWrapper';

export default async function Layout({
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
    <ProtectedDisplay
      allowedRoles={['hacker', 'admin']}
      failRedirectRoute="/login"
    >
      <Navbar />
      {children}
      <HackbotWidgetWrapper initialProfile={profile} />
    </ProtectedDisplay>
  );
}
