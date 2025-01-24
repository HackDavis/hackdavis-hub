import { SessionProvider } from 'next-auth/react';
import StarterKitSlide from './starter-kit/_components/StarterKitSlide';

import ProtectedDisplay from '../../_components/ProtectedDisplay/ProtectedDisplay';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <h1> hi </h1>
      <StarterKitSlide title="Workshop 101" subtitle="JOIN US FOR">
        <p>This is your starter kit. Follow the instructions to set up your project.</p>
      </StarterKitSlide>
      {/* <ProtectedDisplay
        allowedRoles={['hacker', 'admin']}
        failRedirectRoute="/login"
      > */}
        {children}
      {/* </ProtectedDisplay> */}
    </SessionProvider>
  );
}
