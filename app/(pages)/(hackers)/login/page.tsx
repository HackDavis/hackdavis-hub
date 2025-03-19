import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import LoginForm from './_components/LoginForm';
import AuthFormBackground from 'app/(pages)/(hackers)/_components/AuthFormBackground/AuthFormBackground';

export default async function LoginPage() {
  const session = await auth();
  if (session) {
    redirect('/');
  }

  return (
    <AuthFormBackground>
      <LoginForm />
    </AuthFormBackground>
  );
}
