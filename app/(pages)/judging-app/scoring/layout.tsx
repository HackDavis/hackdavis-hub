'use client';

import ProtectedDisplay from '@components/ProtectedDisplay/ProtectedDisplay';
import LoginPage from '../_components/LoginPage/LoginPage';

type Props = {
  children: React.ReactNode;
};

export default function ScoringLayout({ children }: Props) {
  return (
    <ProtectedDisplay loadingDisplay={'loading...'} failDisplay={<LoginPage />}>
      {children}
    </ProtectedDisplay>
  );
}
