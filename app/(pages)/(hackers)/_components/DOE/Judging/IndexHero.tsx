import styles from './IndexHero.module.scss';
import Image from 'next/image';
import baseGrass from 'public/hackers/hero/GrassDivider.svg';
// import baseGrass from 'public/index/hero/grass.svg';
// import needHelpBunny from 'public/index/hero/need-help-bunny.svg';
import bigLeftCloud from 'public/index/hero/big-left-cloud.svg';
import smallLeftCloud from 'public/index/hero/small-left-cloud.svg';
import bigRightCloud from 'public/index/hero/big-right-cloud.svg';
import smallRightCloud from 'public/index/hero/small-right-cloud.svg';
// import IndexHeroContent from '../DOE/Hacking/IndexHeroContent';
import IndexHeroContent from './IndexHeroContent';

export default function IndexHeroJudging() {
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
      <IndexHeroContent />
      <Image src={baseGrass} alt="base grass" className={styles.base_grass} />
    </div>
  );
}
