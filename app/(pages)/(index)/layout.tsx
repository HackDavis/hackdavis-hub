import { AuthProvider } from '@/path/to/your/auth/provider';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
