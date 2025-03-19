import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { getInviteData } from '@actions/invite/getInviteData';
import ResetPasswordForm from './_components/ResetPasswordForm';
import AuthFormBackground from '../_components/AuthFormBackground/AuthFormBackground';

export default async function RegisterPage() {
  const session = await auth();
  if (session) {
    redirect('/');
  }

  const data = await getInviteData();

  if (data?.role === 'judge') {
    redirect('/judges/reset-password');
  }

  return (
    <AuthFormBackground>
      <ResetPasswordForm data={data} />
    </AuthFormBackground>
  );
}
