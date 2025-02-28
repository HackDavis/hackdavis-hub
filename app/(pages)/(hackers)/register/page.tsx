import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { getInviteData } from '@actions/invite/getInviteData';
import RegisterForm from './_components/RegisterForm';
import styles from './page.module.scss';

export default async function RegisterPage() {
  const session = await auth();
  if (session) {
    redirect('/');
  }

  const data = await getInviteData();

  if (data?.role === 'judge') {
    redirect('/judges/register');
  }

  return (
    <div className={styles.container}>
      <RegisterForm data={data} />
    </div>
  );
}
