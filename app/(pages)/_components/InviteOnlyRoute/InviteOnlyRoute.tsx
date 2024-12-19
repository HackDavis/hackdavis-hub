'use client';

import { useInvite } from '@hooks/useInvite';
import { useFirstUser } from '@hooks/useFirstUser';

export default function InviteOnlyRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { pending: pendingInvite, data } = useInvite();
  const { pending: pendingFirst, noUsers } = useFirstUser();

  if (pendingInvite || pendingFirst) {
    return <div>Loading...</div>;
  }
  if (!noUsers && data === null) {
    return <div>Bad Invite Link</div>;
  } else {
    return children;
  }
}
