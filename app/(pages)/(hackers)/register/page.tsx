import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { getInviteData } from '@actions/invite/getInviteData';
import InviteOnlyRoute from '@components/InviteOnlyRoute/InviteOnlyRoute';
import AuthFormBackground from '@pages/(hackers)/_components/AuthFormBackground/AuthFormBackground';
import RegisterForm from '../_components/AuthForms/register/RegisterForm';

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
        title="Welcome to the HackerHub"
        subtitle="Let’s get you started by making an account with us."
      >
        <RegisterForm data={data} />
      </AuthFormBackground>
    </InviteOnlyRoute>
  );
}
