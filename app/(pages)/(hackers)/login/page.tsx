import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import LoginForm from '../_components/AuthForms/LoginForm';
import AuthFormBackground from 'app/(pages)/(hackers)/_components/AuthFormBackground/AuthFormBackground';

export default async function LoginPage() {
  const session = await auth();
  if (session) {
    redirect('/');
  }

  return (
    <AuthFormBackground
      title="Welcome back to the HackerHub"
      subtitle="We’ve missed you, log back in quickly to see what’s happening."
    >
      <LoginForm />
    </AuthFormBackground>
  );
}
