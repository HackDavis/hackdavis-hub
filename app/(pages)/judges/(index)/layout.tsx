import { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';

import ProtectedDisplay from '@components/ProtectedDisplay/ProtectedDisplay';

type Props = {
  children: React.ReactNode;
};

export const metadata: Metadata = {
  title: 'HackDavis Judge Portal',
};

export default function JudgesLayout({ children }: Props) {
  return (
    <SessionProvider>
      <ProtectedDisplay
        allowedRoles={['admin', 'judge']}
        failRedirectRoute="/judges/login"
      >
        {children}
      </ProtectedDisplay>
    </SessionProvider>
  );
}
