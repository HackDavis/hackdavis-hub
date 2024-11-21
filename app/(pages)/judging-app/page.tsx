'use client';
import JudgingHub from './_components/JudgingHub/JudgingHub';
import ProtectedDisplay from '@components/ProtectedDisplay/ProtectedDisplay';

export default function Judges() {
  return (
    <ProtectedDisplay allowedRoles="admin judge" failRedirectPath="/login">
      <JudgingHub />
    </ProtectedDisplay>
  );
}
