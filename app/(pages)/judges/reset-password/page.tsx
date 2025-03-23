import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { getInviteData } from '@actions/invite/getInviteData';
import ResetPasswordForm from '../_components/AuthForms/ResetPasswordForm';
import AuthFormBackground from '../_components/AuthFormBackground/AuthFormBackground';

export default async function RegisterPage() {
  const session = await auth();
  if (session) {
    redirect('/judges');
  }

  const data = await getInviteData();

  if (data?.role === 'hacker') {
    redirect('/reset-password');
  }

  return (
    <AuthFormBackground
      title="Hello!"
      subtitle="Please enter your new password below."
    >
      <ResetPasswordForm data={data} />
    </AuthFormBackground>
  );
}
