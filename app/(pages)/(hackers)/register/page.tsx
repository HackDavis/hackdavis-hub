import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { getInviteData } from '@actions/invite/getInviteData';
import RegisterForm from './_components/RegisterForm';
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
      <AuthFormBackground>
        <RegisterForm data={data} />
      </AuthFormBackground>
    </InviteOnlyRoute>
  );
}
