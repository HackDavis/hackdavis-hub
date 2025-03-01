import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { getUser } from '@actions/users/getUser';
import LogoutAction from '@actions/auth/logout';

export default async function ProtectedDisplay({
  allowedRoles,
  failRedirectRoute,
  children,
}: {
  allowedRoles: string[];
  failRedirectRoute: string;
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect(failRedirectRoute);

  const authorized = allowedRoles.includes(session.user.role);

  const id = session.user.id;
  if (!id) redirect(failRedirectRoute);
  const user = await getUser(id);

  if (!user.ok) {
    LogoutAction();
    redirect(failRedirectRoute);
  }

  if (session.user.role === 'hacker') {
    if (
      user.body.position === undefined ||
      user.body.is_beginner === undefined
    ) {
      redirect('/register/details');
    } else if (authorized) {
      return <>{children}</>;
    } else {
      redirect('/judges');
    }
  } else if (session.user.role === 'judge') {
    if (authorized) {
      return <>{children}</>;
    } else {
      redirect('/');
    }
  } else {
    return <>{children}</>;
  }
}
