import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { getInviteData } from '@actions/invite/getInviteData';
import DetailForm from '../_components/DetailForm';
import LoginBackground from '../../_components/LoginBackground/LoginBackground';

export default async function DetailPage() {
  const session = await auth();
  if (!session || !session.user.id) redirect('/');

  const data = await getInviteData();

  if (data?.role === 'judge') {
    redirect('/judges/register');
  }

  return (
    <LoginBackground>
      <DetailForm data={data} id={session.user.id} />
    </LoginBackground>
  );
}
