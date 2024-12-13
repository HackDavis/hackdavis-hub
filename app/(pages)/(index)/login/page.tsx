import { auth } from '@/auth';
import Form from './form';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const session = await auth();
  if (session) {
    redirect('/');
  }
  return <Form />;
}
