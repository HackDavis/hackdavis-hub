import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import ForgotPasswordForm from '../_components/ForgotPasswordForm';
import AuthFormBackground from '../../_components/AuthFormBackground/AuthFormBackground';

export default async function ForgotPasswordPage() {
  const session = await auth();
  if (session) {
    redirect('/');
  }

  return (
    <AuthFormBackground>
      <ForgotPasswordForm />
    </AuthFormBackground>
  );
}
