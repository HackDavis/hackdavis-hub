'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function ProtectedDisplay({
  allowedRoles,
  children,
}: {
  allowedRoles: string;
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  const roles = allowedRoles.split(' ');
  if (session?.user.role && roles.includes(session?.user.role)) {
    return children;
  } else if (session?.user.role === 'judge') {
    redirect('/judges');
  } else if (session?.user.role === 'hacker') {
    redirect('/');
  } else {
    return <div>Error in Protected Display</div>;
  }
}
