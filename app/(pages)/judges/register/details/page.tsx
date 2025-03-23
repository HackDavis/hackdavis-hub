import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { getUser } from '@actions/users/getUser';
import LogoutAction from '@actions/auth/logout';
import DetailForm from '../../_components/AuthForms/DetailForm';
import AuthFormBackground from '../../_components/AuthFormBackground/AuthFormBackground';

export default async function DetailPage() {
  const session = await auth();
  if (!session || !session.user.id) redirect('/judges');

  const user = await getUser(session.user.id);
  if (!user.ok) {
    await LogoutAction();
    redirect('/');
  }

  if (user.body.role === 'hacker') redirect('/register');

  return (
    <AuthFormBackground
      title={`Hi ${user.body.name}!`}
      subtitle="One more thing before you begin judging. Please rank your expertise in these domains."
    >
      <DetailForm id={session.user.id} />
    </AuthFormBackground>
  );
}
