import { Metadata } from 'next';

import ProtectedDisplay from '../../_components/ProtectedDisplay/ProtectedDisplay';

type Props = {
  children: React.ReactNode;
};

export const metadata: Metadata = {
  title: 'HackDavis Judge Portal',
};

export default function JudgesLayout({ children }: Props) {
  return (
    <ProtectedDisplay
      allowedRoles={['admin', 'judge']}
      failRedirectRoute="/judges/login"
    >
      <div className="max-w-[500px] min-w-[370px] ml-auto mr-auto">
        {children}
      </div>
    </ProtectedDisplay>
  );
}
