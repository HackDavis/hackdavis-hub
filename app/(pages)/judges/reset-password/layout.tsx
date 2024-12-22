// import InviteOnlyRoute from '@components/InviteOnlyRoute/InviteOnlyRoute';

import { Suspense } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  // return <InviteOnlyRoute>{children}</InviteOnlyRoute>;
  return <Suspense>{children}</Suspense>;
}
