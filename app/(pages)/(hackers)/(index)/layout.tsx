import { SessionProvider } from 'next-auth/react';
import WorkshopSlides from './starter-kit/_components/WorkshopSlides';

import ProtectedDisplay from '../../_components/ProtectedDisplay/ProtectedDisplay';
import StarterKitSlide from './starter-kit/_components/StarterKitSlide';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
  
      <StarterKitSlide
      subtitle="HERE'S A RECAP OF THE WORKSHOP"
      title="In case you missed it..."
    >
      <WorkshopSlides/>
      
    </StarterKitSlide>
  

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
