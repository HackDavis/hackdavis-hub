import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { getUser } from '@actions/users/getUser';
import LogoutAction from '@actions/auth/logout';
import DetailForm from '../_components/DetailForm';
import LoginBackground from '../../_components/LoginBackground/LoginBackground';

export default async function DetailPage() {
  const session = await auth();
  if (!session || !session.user.id) redirect('/');

  const user = await getUser(session.user.id);
  if (!user.ok) {
    await LogoutAction();
    redirect('/');
  }

  if (user.body.role === 'judge') redirect('/judges/register');

  return (
    <LoginBackground>
      <DetailForm id={session.user.id} name={user.body.name} />
    </LoginBackground>
  );
}
