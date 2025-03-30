import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { getUser } from '@actions/users/getUser';
import LogoutAction from '@actions/auth/logout';

export default async function CodeProtectedDisplay({
  failRedirectRoute,
  children,
}: {
  failRedirectRoute: string;
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect(failRedirectRoute);

  const id = session.user.id;
  if (!id) redirect(failRedirectRoute);
  const user = await getUser(id);

  if (!user.ok) {
    await LogoutAction();
    return (
      <div>
        User was manually deleted from the database, clear cookies and
        re-register.
      </div>
    );
  }

  if (user.body.has_checked_in) {
    return <>{children}</>;
  } else {
    redirect(failRedirectRoute);
  }
}
