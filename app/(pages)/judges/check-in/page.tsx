import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { getUser } from '@actions/users/getUser';
import LogoutAction from '@actions/auth/logout';
import AuthFormBackground from '../_components/AuthFormBackground/AuthFormBackground';
import CheckInForm from '../_components/AuthForms/CheckInForm';

export default async function CheckInPage() {
  const session = await auth();
  if (!session) redirect('/judges/login');

  const user = await getUser(session.user.id);
  if (!user.ok) {
    await LogoutAction();
    redirect('/');
  }

  if (user.body.role === 'hacker') redirect('/');

  return (
    <AuthFormBackground
      title="Welcome Judges!"
      subtitle="Enter the check-in code when you're here at the hackathon so you can start judging!"
    >
      <CheckInForm id={session.user.id} />
    </AuthFormBackground>
  );
}
