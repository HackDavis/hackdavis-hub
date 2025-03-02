import styles from './Login.module.scss';
import Image from 'next/image';
import Logo from 'public/hackers/mvp/HDLogo.svg';

export default async function RegistrationLogin({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.container}>
      {/* put children in here ! */}
      <div className={styles.overlayContent}>{children}</div>

      <div className={styles.scenery}>
        <Image src={Logo} alt="hackdavis logo" className={styles.logo} />
      </div>
    </div>
  );
}
