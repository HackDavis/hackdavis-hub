import AdminProtected from '@components/AdminProtected/AdminProtected';
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
    <AdminProtected
      loadingDisplay={'loading...'}
      failDisplay={"you aren't the admin 😡"}
    >
      {children}
    </AdminProtected>
  );
}
