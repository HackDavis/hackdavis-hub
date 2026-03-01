import ProtectedDisplay from '@components/ProtectedDisplay/ProtectedDisplay';
import Navbar from '@components/Navbar/Navbar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
    {/* // <ProtectedDisplay */}
    {/* //   allowedRoles={['hacker', 'admin']}
    //   failRedirectRoute="/login"
    // > */}
      <Navbar />
      {children}
    {/* // </ProtectedDisplay> */}
    </div>
  );
}
