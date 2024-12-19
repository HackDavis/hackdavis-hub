'use client';

import ProtectedDisplay from '@components/ProtectedDisplay/ProtectedDisplay';

type Props = {
  children: React.ReactNode;
};

export default function ScoringLayout({ children }: Props) {
  return (
    <ProtectedDisplay allowedRoles="admin judge">{children}</ProtectedDisplay>
  );
}
