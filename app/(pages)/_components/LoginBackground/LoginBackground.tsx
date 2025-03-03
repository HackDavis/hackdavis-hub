import Image from 'next/image';
import Logo from 'public/hackers/mvp/HDLogo.svg';
import styles from './LoginBackground.module.scss';

export default async function LoginBackground({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.container}>
      <div className={styles.overlayContent}>{children}</div>
      <div className={styles.scenery}>
        <Image src={Logo} alt="hackdavis logo" className={styles.logo} />
      </div>
    </div>
  );
}
