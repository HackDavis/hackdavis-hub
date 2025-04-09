import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { getInviteData } from '@actions/invite/getInviteData';
import RegisterForm from '@pages/judges/_components/AuthForms/RegisterForm';
import AuthFormBackground from '../_components/AuthFormBackground/AuthFormBackground';
import InviteOnlyRoute from '@components/InviteOnlyRoute/InviteOnlyRoute';

export default async function RegisterPage() {
  const session = await auth();
  if (session) redirect('/');

  const data = await getInviteData();

  if (data?.role === 'judge') {
    redirect('/judges/register');
  }

  return (
    <InviteOnlyRoute>
      <AuthFormBackground
        title={`Hi ${data?.name ?? 'HackDavis Admin'}!`}
        subtitle={`Welcome to the HackerHub! The HackDavis team made this for all your hacking needs <3
                  Let's get you started by making a password with us.`}
      >
        <RegisterForm data={data} />
      </AuthFormBackground>
    </InviteOnlyRoute>
  );
}
