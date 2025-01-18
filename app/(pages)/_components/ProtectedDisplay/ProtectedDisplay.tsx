'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function ProtectedDisplay({
  allowedRoles,
  failRedirectRoute,
  children,
}: {
  allowedRoles: string[];
  failRedirectRoute: string;
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (session?.user.role && allowedRoles.includes(session?.user.role)) {
    return children;
  } else if (session?.user.role === 'judge') {
    redirect('/judges');
  } else if (session?.user.role === 'hacker') {
    redirect('/');
  } else {
    redirect(failRedirectRoute);
  }
}
