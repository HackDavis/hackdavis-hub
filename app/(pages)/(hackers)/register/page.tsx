import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { getInviteData } from '@actions/invite/getInviteData';

import RegisterFlow from '@pages/_components/RegisterFlow';

export default async function RegisterPage() {
  const session = await auth();
  if (session) redirect('/');

  const data = await getInviteData();

  if (data?.role === 'judge') {
    redirect('/judges/register');
  }

  return <RegisterFlow data={data} />;
}
