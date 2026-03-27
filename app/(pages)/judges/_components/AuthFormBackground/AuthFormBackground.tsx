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
      <div className={`${styles.section} ${styles.logo_section}`}>
        <div className={styles.logo_container}>
          <Image src={hd_logo} alt="hd_logo" height={74} width={74} />
        </div>
      </div>

      <div className={`${styles.section} ${styles.title_section}`}>
        <h3>
          <b>{title}</b>
        </h3>
        <p style={{ whiteSpace: 'pre-line' }}>{subtitle}</p>
      </div>

      <div className={`${styles.section} ${styles.form_section}`}>
        {children}
      </div>
    </div>
  );
}
