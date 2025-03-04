import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import ForgotPasswordForm from '../_components/ForgotPasswordForm';
import LoginBackground from '../../_components/LoginBackground/LoginBackground';

export default async function ForgotPasswordPage() {
  const session = await auth();
  if (session) {
    redirect('/');
  }

  return (
    <LoginBackground>
      <ForgotPasswordForm />
    </LoginBackground>
  );
}
