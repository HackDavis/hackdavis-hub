import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function ProtectedDisplay({
  allowedRoles,
  failRedirectRoute,
  children,
}: {
  allowedRoles: string[];
  failRedirectRoute: string;
  children: React.ReactNode;
}) {
  const session = await auth();

  if (session?.user.role && allowedRoles.includes(session?.user.role)) {
    return <>{children}</>;
  } else if (session?.user.role === 'judge') {
    redirect('/judges');
  } else if (session?.user.role === 'hacker') {
    redirect('/');
  } else {
    redirect(failRedirectRoute);
  }
}
