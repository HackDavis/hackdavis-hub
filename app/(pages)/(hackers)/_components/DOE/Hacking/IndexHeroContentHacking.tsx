'use client';

import Image from 'next/image';
import Countdown from '../../IndexHero/Countdown';
import styles from './IndexHeroContentHacking.module.scss';
import MusicPlayer from '../../IndexHero/MusicPlayer';
import star_icon from '@public/hackers/hero/star.svg';
// import cow_tada from '@public/hackers/hero/cow_tada.svg';
import Scroll from '../../IndexHero/Scroll';
import { LuArrowUpRight } from 'react-icons/lu';
import star from 'public/index/hero/star.svg';
// import NextSchedule from '../../IndexHero/NextSchedule';
// import TimeTracker from '../../IndexHero/TimeTracker';
import { GoArrowRight } from 'react-icons/go';
import Announcements from '../../IndexHero/Announcements';
import { useRollout } from '@pages/_hooks/useRollout';
import ClientTimeProtectedDisplay from '@pages/_components/TimeProtectedDisplay/ClientTimeProtectedDisplay';
import TimeTracker from '../../IndexHero/TimeTracker';
import NextSchedule from '../../IndexHero/NextSchedule';

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
          <p className={styles.map}>ARC BALLROOM MAP</p>
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

      <div className={styles.group_width}>
        <div
          style={{
            display: 'flex',
            gap: '1%',
            paddingBottom: '1%',
            alignItems: 'center',
          }}
        >
          <p>NEXT ON YOUR SCHEDULE</p>
          <Image
            src={star_icon}
            alt="star icon"
            className={styles.star_icon_img}
          />
          <div className={styles.countdown}>
            <TimeTracker targetTime="2025-05-01T09:00:00Z" />
          </div>
        </div>
        <NextSchedule />
      </div>
      <Announcements />
    </div>
  );
}
