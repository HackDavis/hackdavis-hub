import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { getUser } from '@actions/users/getUser';
import LogoutAction from '@actions/auth/logout';
import DetailForm from '../../_components/AuthForms/DetailForm';
import AuthFormBackground from '../../_components/AuthFormBackground/AuthFormBackground';

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
    <AuthFormBackground
      title={`Hi ${user.body.name}!`}
      subtitle={`One more thing before you enter the hub.
                Choose what suits you the most:`}
    >
      <DetailForm id={session.user.id} />
    </AuthFormBackground>
  );
}
