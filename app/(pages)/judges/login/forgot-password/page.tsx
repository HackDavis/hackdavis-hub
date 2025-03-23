import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import ForgotPasswordForm from '../../_components/AuthForms/ForgotPasswordForm';
import AuthFormBackground from '../../_components/AuthFormBackground/AuthFormBackground';

export default async function ForgotPasswordPage() {
  const session = await auth();
  if (session) {
    redirect('/judges');
  }

  return (
    <AuthFormBackground
      title="Hello!"
      subtitle="Please enter your email below."
    >
      <ForgotPasswordForm />
    </AuthFormBackground>
  );
}
