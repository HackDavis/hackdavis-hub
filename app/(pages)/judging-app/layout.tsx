import { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';

type Props = {
  children: React.ReactNode;
};

export const metadata: Metadata = {
  title: 'HackDavis Judge Portal',
};

export default function JudgesLayout({ children }: Props) {
  return <SessionProvider>{children}</SessionProvider>;
}
