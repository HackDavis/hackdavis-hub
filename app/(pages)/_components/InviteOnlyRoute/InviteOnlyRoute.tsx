import { cookies } from 'next/headers';

import verifyInvite from '@actions/invite/verifyInvite';
import { getManyUsers } from '@actions/users/getUser';

export default async function InviteOnlyRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = cookies().get('data');
  const sig = cookies().get('sig');

  const users = await getManyUsers();
  const noUsers = users.body.length === 0;

  if (
    (data === undefined ||
      sig === undefined ||
      !(await verifyInvite(data.value, sig.value))) &&
    !noUsers
  ) {
    return <div>Bad Invite Link</div>;
  } else {
    return <>{children}</>;
  }
}
