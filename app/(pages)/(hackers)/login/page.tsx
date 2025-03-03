import { redirect } from 'next/navigation';

import { auth } from '@/auth';
// import LoginForm from './_components/LoginForm';

// hay added
import RegistrationLogin from '@components/Login/Login';

export default async function LoginPage() {
  const session = await auth();
  if (session) {
    redirect('/');
  }
  return (
    <RegistrationLogin>
      <p>insert login form here</p>
    </RegistrationLogin>
  );
}
