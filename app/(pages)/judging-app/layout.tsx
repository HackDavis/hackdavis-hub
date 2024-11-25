import { AuthProvider } from '../_contexts/AuthContext';
import { Metadata } from 'next';

type Props = {
  children: React.ReactNode;
};

export const metadata: Metadata = {
  title: 'HackDavis Judge Portal',
};

export default function JudgesLayout({ children }: Props) {
  return (
    <AuthProvider>
      <div className="tw-mx-auto tw-min-w-[370px] tw-max-w-[500px]">
        {children}
      </div>
    </AuthProvider>
  );
}
