import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import LoginForm from './_components/LoginForm';
import LoginBackground from '@components/LoginBackground/LoginBackground';

export default async function LoginPage() {
  const session = await auth();
  if (session) {
    redirect('/');
  }

  return (
    <LoginBackground>
      <LoginForm />
    </LoginBackground>
  );
}
