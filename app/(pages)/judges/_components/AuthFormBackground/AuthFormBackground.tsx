import Image from 'next/image';

import styles from './AuthFormBackground.module.scss';
import hd_logo from 'public/judges/login/hd_logo.svg';

export default async function AuthFormBackground({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <Image src={hd_logo} alt="hd_logo" height={50} width={50} />
      </div>

      <div className={styles.section}>
        <h3>
          <b>{title}</b>
        </h3>
        <p style={{ whiteSpace: 'pre-line' }}>{subtitle}</p>
      </div>

      <div className={styles.section}>{children}</div>
    </div>
  );
}
