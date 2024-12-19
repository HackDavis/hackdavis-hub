'use client';

import { useSession } from 'next-auth/react';

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
  } else {
    return <div>Error in Protected Display</div>;
  }
}
