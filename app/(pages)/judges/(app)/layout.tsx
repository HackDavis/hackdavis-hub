import { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';

import ProtectedDisplay from '../../_components/ProtectedDisplay/ProtectedDisplay';

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
        <div className="max-w-[500px] min-w-[370px] min-h-screen ml-auto mr-auto">
          {children}
        </div>
      </ProtectedDisplay>
    </SessionProvider>
  );
}
