import Image from 'next/image';
import Countdown from './Countdown';
import styles from './IndexHeroContent.module.scss';
import MusicPlayer from './MusicPlayer';
import Scroll from './Scroll';

import star from 'public/index/hero/star.svg';

export default function IndexHeroContent() {
  return (
    <div className={styles.container}>
      <p className={styles.date}>
        APRIL 19-20
        <br />
        2025
      </p>
      <MusicPlayer />
      <div className={styles.center_right}>
        <Countdown />
        <p className={styles.info}>
          A HACKDAVIS HUB
          <br />
          FOR EVERYONE WHO
          <span className={styles.monospace}>
            {' // creates for social good'}
          </span>
        </p>
      </div>
      <Scroll />
      <p className={styles.notification}>
        Hi hacker, it seems like you’re here a little early... Check back in{' '}
        <strong> later this month </strong> for more information!
      </p>
      <div className={styles.star_social_good}>
        <div className={styles.star_box}>
          <Image src={star} alt="star" className={styles.box_star} />
        </div>
        <div className={styles.social_good}>{'// for social good'}</div>
      </div>
      <div className={styles.spacer_star_container}>
        <Image src={star} alt="star" className={styles.spacer_star} />
      </div>
    </div>
  );
}
