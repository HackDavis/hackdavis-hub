import ProtectedDisplay from '@components/ProtectedDisplay/ProtectedDisplay';
import Navbar from '@components/Navbar/Navbar';
import HackbotWidget from '@pages/(hackers)/_components/Hackbot/HackbotWidget';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedDisplay
      allowedRoles={['hacker', 'admin']}
      failRedirectRoute="/login"
    >
      <Navbar />
      {children}
      <HackbotWidget />
    </ProtectedDisplay>
  );
}
