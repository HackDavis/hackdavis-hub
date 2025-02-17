// import { SessionProvider } from 'next-auth/react';
import FindATeam from './starter-kit/_components/FindATeam/FindATeam';

// import ProtectedDisplay from '../../_components/ProtectedDisplay/ProtectedDisplay';
// import StarterKitSlide from './starter-kit/_components/StarterKitSlide';

export default function Layout(/* { children }: { children: React.ReactNode } */) {
  return (
    <FindATeam />

    // <SessionProvider>

    //   {/* <ProtectedDisplay
    //     allowedRoles={['hacker', 'admin']}
    //     failRedirectRoute="/login"
    //   >
    //     {children}
    //   </ProtectedDisplay> */}
    // </SessionProvider>
  );
}
