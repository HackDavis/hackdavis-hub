// import { SessionProvider } from 'next-auth/react';

// import ProtectedDisplay from '../../_components/ProtectedDisplay/ProtectedDisplay';

// export default function Layout({ children }: { children: React.ReactNode }) {
//   return (
//     <SessionProvider>
//       <ProtectedDisplay
//         allowedRoles={['hacker', 'admin']}
//         failRedirectRoute="/login"
//       >
//         {children}
//       </ProtectedDisplay>
//     </SessionProvider>
//   );
// }

// import { SessionProvider } from 'next-auth/react';
import FindATeam from '../_components/StarterKitStages/FindATeam';
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
