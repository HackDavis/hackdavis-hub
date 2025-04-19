'use client';

import Image from 'next/image';
import { LuArrowUpRight } from 'react-icons/lu';
import { GoArrowRight } from 'react-icons/go';
import styles from './IndexHeroContentHacking.module.scss';
import MusicPlayer from '../../IndexHero/MusicPlayer';
import Scroll from '../../IndexHero/Scroll';
import { useRollout } from '@pages/_hooks/useRollout';
import ClientTimeProtectedDisplay from '@pages/_components/TimeProtectedDisplay/ClientTimeProtectedDisplay';
import Announcements from '../../IndexHero/Announcements';
import NextSchedule from '../../IndexHero/NextSchedule';
import Countdown from '../../IndexHero/Countdown';

import star from 'public/index/hero/star.svg';

export default function IndexHeroContentHacking() {
  const { loading, rolloutRes, fetchRollout } = useRollout('hacking-starts');

  if (loading) return null;
  if (!rolloutRes.ok) return JSON.stringify(rolloutRes.error);

  const countdownTarget = rolloutRes.body.rollout_time + 24 * 60 * 60 * 1000;

  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        <p className={styles.date}>
          APRIL 19-20
          <br />
          2025
        </p>
        <a
          href="https://drive.google.com/file/d/1l6fxi9jDKlleaStt4xXSgCjVg4dfQkjz/view?usp=sharing"
          className={styles.link}
        >
          <p className={styles.map}>VENUE MAP</p>
          <LuArrowUpRight size={23} />
        </a>
      </div>
      <div className={styles.spacer_star_container}>
        <Image src={star} alt="star" className={styles.spacer_star} />
      </div>
      <div className={styles.heroRow}>
        <MusicPlayer />
        <div className={styles.center_right}>
          <div className={styles.countdown}>
            <ClientTimeProtectedDisplay
              featureId="hacking-starts"
              fallback={<Countdown />}
              callback={() => fetchRollout('hacking-starts')}
            >
              <Countdown countdownTarget={countdownTarget} />
            </ClientTimeProtectedDisplay>
          </div>
          <div className={styles.belowClock}>
            <p className={styles.info}>
              A HACKDAVIS HUB
              <br />
              FOR EVERYONE WHO
              <span className={styles.monospace}>
                {' // creates for social good'}
              </span>
            </p>
            <button className={styles.submitButton}>
              <p>SUBMIT!</p>
              <GoArrowRight className={styles.submitArrow} />
            </button>
          </div>
          <div className={styles.scrollSection}>
            <Scroll />
          </div>
        </div>

        {/* bottom one */}
        <div className={styles.star_social_good}>
          <div className={styles.star_box}>
            <Image src={star} alt="star" className={styles.box_star} />
          </div>
          <div className={styles.social_good}>{'// for social good'}</div>
        </div>
      </div>
      <div className={styles.spacer_star_container}>
        <Image src={star} alt="star" className={styles.spacer_star} />
      </div>
      <div className={styles.scrollDesktopSection}>
        <Scroll />
      </div>
      <NextSchedule />
      <Announcements />
    </div>
  );
}
