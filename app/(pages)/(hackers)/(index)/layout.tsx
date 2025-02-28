import { SessionProvider } from 'next-auth/react';

import ProtectedDisplay from '@components/ProtectedDisplay/ProtectedDisplay';
import CompleteRegistration from '@components/CompleteRegistration/CompleteRegistration';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <CompleteRegistration>
      <SessionProvider>
        <ProtectedDisplay
          allowedRoles={['hacker', 'admin']}
          failRedirectRoute="/login"
        >
          {children}
        </ProtectedDisplay>
      </SessionProvider>
    </CompleteRegistration>
  );
}
