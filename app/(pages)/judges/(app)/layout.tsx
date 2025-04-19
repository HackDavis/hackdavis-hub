import { Metadata } from 'next';

import ProtectedDisplay from '../../_components/ProtectedDisplay/ProtectedDisplay';
import CodeProtectedDisplay from '@components/CodeProtectedDisplay/CodeProtectedDisplay';
import TimeProtectedDisplay from '@pages/_components/TimeProtectedDisplay/TimeProtectedDisplay';

type Props = {
  children: React.ReactNode;
};

export const metadata: Metadata = {
  title: 'HackDavis Judge Portal',
};

export default async function JudgesLayout({ children }: Props) {
  return (
    <ProtectedDisplay
      allowedRoles={['admin', 'judge']}
      failRedirectRoute="/judges/login"
    >
      <TimeProtectedDisplay featureId="judge-check-in" fallback={children}>
        <CodeProtectedDisplay failRedirectRoute="/judges/check-in">
          {children}
        </CodeProtectedDisplay>
      </TimeProtectedDisplay>
    </ProtectedDisplay>
  );
}
