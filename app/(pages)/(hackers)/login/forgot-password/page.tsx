import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import ForgotPasswordForm from '@pages/judges/_components/AuthForms/ForgotPasswordForm';
import AuthFormBackground from '../../_components/AuthFormBackground/AuthFormBackground';

export default async function ForgotPasswordPage() {
  const session = await auth();
  if (session) {
    redirect('/');
  }

  return (
    <AuthFormBackground
      title="Hi Hacker!"
      subtitle="Please enter your email below."
    >
      <ForgotPasswordForm />
    </AuthFormBackground>
  );
}
