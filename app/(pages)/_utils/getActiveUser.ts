import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { getUser } from '@actions/users/getUser';
import LogoutAction from '@actions/auth/logout';

export default async function getActiveUser(failRedirectRoute: string) {
  const session = await auth();
  if (!session) redirect(failRedirectRoute);

  const userRes = await getUser(session.user.id);

  if (!userRes.ok || !userRes.body) {
    await LogoutAction();
    redirect('/error');
  }

  return userRes.body;
}
