// import { auth } from '@/auth';
// import { redirect } from 'next/navigation';
import styles from './Login.module.scss';

export default async function RegistrationLogin({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={styles.container}>{children}</div>;
}
