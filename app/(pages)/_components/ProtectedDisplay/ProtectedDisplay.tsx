'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function ProtectedDisplay({
  children,
  allowedRoles,
  failRedirectPath,
}: {
  children: React.ReactNode;
  allowedRoles: string;
  failRedirectPath: string;
}) {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session || status !== 'authenticated') {
    router.push(failRedirectPath);
  }

  const roles = allowedRoles.split(' ');
  for (const role of roles) {
    if (role === session?.user.role) {
      return children;
    }
  }

  router.push(failRedirectPath);
}
