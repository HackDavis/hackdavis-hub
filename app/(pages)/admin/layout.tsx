import ProtectedDisplay from '../_components/ProtectedDisplay/ProtectedDisplay';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'HackDavis Admin Panel',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adminEmail = process.env.HUB_ADMIN_EMAIL;

  if (!adminEmail) {
    console.warn(
      'HUB_ADMIN_EMAIL environment variable is not set, no users will have access to the admin panel'
    );
  }

  const parsedAdminEmail = adminEmail ? adminEmail : '';

  return (
    <ProtectedDisplay
      allowedRoles={['admin']}
      allowedUsers={[parsedAdminEmail]}
      failRedirectRoute="/login"
    >
      {children}
    </ProtectedDisplay>
  );
}
