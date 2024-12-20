import { redirect } from 'next/navigation';
import Image from 'next/image';

import { auth } from '@/auth';
import LoginForm from './_components/LoginForm';
import styles from './page.module.scss';

export default async function LoginPage() {
  const session = await auth();
  if (session) {
    redirect('/judges');
  }

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <Image src="/login/hd_logo.svg" alt="hd_logo" height={50} width={50} />
      </div>
      <div className={styles.section}>
        <h3>
          <b>Welcome Judges!</b>
        </h3>
        <p>Enter your username and password.</p>
      </div>
      <div className={styles.section}>
        <LoginForm />
      </div>
    </div>
  );
}
