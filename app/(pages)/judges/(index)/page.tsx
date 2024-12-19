import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import JudgingHub from './_components/JudgingHub/JudgingHub';

export default async function Judges() {
  const session = await auth();
  if (session) {
    redirect('/');
  }
  return <JudgingHub />;
}
