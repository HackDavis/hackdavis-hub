import ProtectedDisplay from '@components/ProtectedDisplay/ProtectedDisplay';
import { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';

export const metadata: Metadata = {
  title: 'HackDavis Admin Panel',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <ProtectedDisplay allowedRoles="admin">{children}</ProtectedDisplay>
    </SessionProvider>
  );
}