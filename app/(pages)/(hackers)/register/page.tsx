import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { getInviteData } from '@actions/invite/getInviteData';

import RegisterFlow from '@pages/_components/RegisterFlow';
import AuthFormBackground from '../_components/AuthFormBackground/AuthFormBackground';

export default async function RegisterPage() {
  const session = await auth();
  if (session) redirect('/');

  const data = await getInviteData();

  if (data?.role === 'judge') {
    redirect('/judges/register');
  }

  return (
    <AuthFormBackground
      title={`Hi ${data?.name ?? 'HackDavis Admin'}!`}
      subtitle={`Welcome to the HackerHub! The HackDavis team made this for all your hacking needs <3
      Let's get you started by making a password with us.`}
    >
      <RegisterFlow data={data} />
    </AuthFormBackground>
  );
}