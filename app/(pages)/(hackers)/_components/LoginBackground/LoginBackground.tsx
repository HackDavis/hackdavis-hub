import Image from 'next/image';
import Logo from 'public/hackers/mvp/HDLogo.svg';
import styles from './LoginBackground.module.scss';
import grassAsset from '@public/hackers/mvp/grass_asset.svg';
import mascots from '@public/hackers/mvp/peeking_around_wall.svg';

export default async function LoginBackground({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.container}>
      <Image src={Logo} alt="hackdavis logo" className={styles.logo} />
      <div className={styles.overlayContent}>{children}</div>
      <div className={styles.grass_asset}>
        <Image src={grassAsset} alt="grass asset" className={styles.grass} />
        <Image src={mascots} alt="mascots" className={styles.mascots} />
      </div>
    </div>
  );
}
