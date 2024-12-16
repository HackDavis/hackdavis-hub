import { SessionProvider } from 'next-auth/react';

import ProtectedDisplay from '@components/ProtectedDisplay/ProtectedDisplay';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ProtectedDisplay allowedRoles="hacker admin">
        {children}
      </ProtectedDisplay>
    </SessionProvider>
  );
}
