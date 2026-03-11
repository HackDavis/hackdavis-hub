import styles from './IndexHero.module.scss';
import Image from 'next/image';
import baseGrass from '@public/hackers/hero/GrassDivider.svg';
import bigLeftCloud from '@public/hackers/index-hero/big-left-cloud.svg';
import smallLeftCloud from '@public/hackers/index-hero/small-left-cloud.svg';
import bigRightCloud from '@public/hackers/index-hero/big-right-cloud.svg';
import smallRightCloud from '@public/hackers/index-hero/small-right-cloud.svg';

export default function IndexHero({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.container}>
      <Image src={bigLeftCloud} alt="cloud" className={styles.big_left_cloud} />
      <Image
        src={smallLeftCloud}
        alt="cloud"
        className={styles.small_left_cloud}
      />
      <Image
        src={bigRightCloud}
        alt="cloud"
        className={styles.big_right_cloud}
      />
      <Image
        src={smallRightCloud}
        alt="cloud"
        className={styles.small_right_cloud}
      />
      <div className={styles.children}>{children}</div>
      <Image src={baseGrass} alt="base grass" className={styles.base_grass} />
    </div>
  );
}
