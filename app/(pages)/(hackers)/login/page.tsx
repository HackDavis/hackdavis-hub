// import { redirect } from 'next/navigation';

// import { auth } from '@/auth';
import LoginForm from './_components/LoginForm';

export default async function LoginPage() {
  // const session = await auth();
  // if (session) {
  //   redirect('/');
  // }
  return <LoginForm />;
}
