import { SessionProvider } from 'next-auth/react';
import StarterKitSlide from '../_components/StarterKit/StarterKitSlide';
import FindTheRightFit from '../_components/StarterKit/FindTheRightFit/FindTheRightFit';
// import ProtectedDisplay from '../../_components/ProtectedDisplay/ProtectedDisplay';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <StarterKitSlide>
      <<FindTheRightFit/>
    </StarterKitSlide>
    // <SessionProvider>
    //   <ProtectedDisplay
    //     allowedRoles={['hacker', 'admin']}
    //     failRedirectRoute="/login"
    //   >
    //     {children}
    //   </ProtectedDisplay>
    // </SessionProvider>
  );
}
