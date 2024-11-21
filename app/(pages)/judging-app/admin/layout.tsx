import ProtectedDisplay from '@components/ProtectedDisplay/ProtectedDisplay';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'HackDavis Admin Panel',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedDisplay allowedRoles="admin" failRedirectPath="/">
      {children}
    </ProtectedDisplay>
  );
}
