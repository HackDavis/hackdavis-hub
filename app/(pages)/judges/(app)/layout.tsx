import { Metadata } from "next";

import ProtectedDisplay from "../../_components/ProtectedDisplay/ProtectedDisplay";
// import CodeProtectedDisplay from '@components/CodeProtectedDisplay/CodeProtectedDisplay';

type Props = {
  children: React.ReactNode;
};

export const metadata: Metadata = {
  title: "HackDavis Judge Portal",
};

export default function JudgesLayout({ children }: Props) {
  return (
    <ProtectedDisplay
      allowedRoles={["admin", "judge"]}
      failRedirectRoute="/judges/login"
    >
      {/* <CodeProtectedDisplay failRedirectRoute="/judges/check-in"> */}
      {children}
      {/* </CodeProtectedDisplay> */}
    </ProtectedDisplay>
  );
}
