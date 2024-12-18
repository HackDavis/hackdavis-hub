import { AuthProvider } from '../_contexts/AuthContext';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
