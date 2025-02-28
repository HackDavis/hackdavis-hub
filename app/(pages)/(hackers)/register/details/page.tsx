import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

import { getInviteData } from '@actions/invite/getInviteData';
import DetailForm from '../_components/DetailForm';
import styles from './page.module.scss';

export default async function DetailPage() {
  const data = await getInviteData();

  if (data?.role === 'judge') {
    redirect('/judges/register');
  }

  const id = cookies().get('registerId');
  if (!id) redirect('/');

  return (
    <div className={styles.container}>
      <DetailForm data={data} id={id.value} />
    </div>
  );
}
