import { SessionProvider } from 'next-auth/react';
import StarterKitSlide from './starter-kit/_components/StarterKitSlide';
import EventPosting from './starter-kit/_components/EventPosting';

// import ProtectedDisplay from '../../_components/ProtectedDisplay/ProtectedDisplay';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <StarterKitSlide title="Workshop 101" subtitle="JOIN US FOR">
        <EventPosting
          location="ARC Ballroom C"
          color="#005271"
          time="11am - 12pm"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip"
        ></EventPosting>
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
