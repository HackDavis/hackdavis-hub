import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import ForgotPasswordForm from '../_components/ForgotPasswordForm';

export default async function ForgotPasswordPage() {
  const session = await auth();
  if (session) {
    redirect('/');
  }

  return (
    <div>
      <ForgotPasswordForm />
    </div>
  );
}
