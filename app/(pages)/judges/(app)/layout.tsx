import { Metadata } from 'next';

import ProtectedDisplay from '../../_components/ProtectedDisplay/ProtectedDisplay';
import CodeProtectedDisplay from '@components/CodeProtectedDisplay/CodeProtectedDisplay';
import FeatureGate from '@pages/_components/FeatureGate/FeatureGate';

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
      <FeatureGate featureId="judge-check-in" unavailableView={children}>
        <CodeProtectedDisplay failRedirectRoute="/judges/check-in">
          {children}
        </CodeProtectedDisplay>
      </FeatureGate>
    </ProtectedDisplay>
  );
}
