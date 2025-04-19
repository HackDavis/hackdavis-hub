import Image from 'next/image';
// import Countdown from './Countdown';
import styles from './IndexHeroContentJudging.module.scss';
import MusicPlayer from '../../IndexHero/MusicPlayer';
import star_icon from '@public/hackers/hero/star.svg';
// import cow_tada from '@public/hackers/hero/cow_tada.svg';
import judge_bunny_and_ducky from '@public/hackers/hero/judge_bunny_and_ducky.svg';
import Scroll from '../../IndexHero/Scroll';
import { LuArrowUpRight } from 'react-icons/lu';
// import Map from '@pages/judges/(app)/map/_components/Map/Map';
import star from 'public/index/hero/star.svg';
// import Announcement from './Announcement';
import NextSchedule from '../../IndexHero/NextSchedule';
import Link from 'next/link';
import TimeTracker from '../../IndexHero/TimeTracker';
// import Notifications from './Notifications';
import JudgeBanners from '../../IndexHero/JudgeBanners';
import { GoArrowRight } from 'react-icons/go';
import Announcements from '../../IndexHero/Announcements';

export default function IndexHeroContentJudging() {
  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        <p className={styles.date}>
          APRIL 19-20
          <br />
          2025
        </p>
        <a href="/map" className={styles.link}>
          <p className={styles.map}>ARC BALLROOM MAP</p>
          <LuArrowUpRight size={23} />
        </a>
        <div>
          {/* <JudgeBanners /> */}
          {/* <Notifications /> */}
        </div>
      </div>

      <div className={styles.spacer_star_container}>
        <Image src={star} alt="star" className={styles.spacer_star} />
      </div>

      <div className={styles.heroRow}>
        <MusicPlayer />
        <div className={styles.center_right}>
          {/* <Countdown /> */}
          <JudgeBanners />
          {/* please work bro */}
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
        </div>
      </div>
      <Announcements />

      <div className={styles.star_social_good}>
        <div className={styles.star_box}>
          <Image src={star} alt="star" className={styles.box_star} />
        </div>
        <div className={styles.social_good}>{'// for social good'}</div>
      </div>

      <div className={styles.spacer_star_container}>
        <Image src={star} alt="star" className={styles.spacer_star} />
      </div>
      <Scroll />

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
        {/* <NextSchedule /> */}
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
          <p>WHILE YOU WAIT, CHECK OUT OUR JUDGING INFORMATION</p>
          <Image
            src={star_icon}
            alt="star icon"
            className={styles.star_icon_img}
          />
        </div>
        <div className={styles.judge_info}>
          <div style={{ width: '50%' }}>
            <h2>
              <strong>Judging Information</strong>
            </h2>
            <Link href={'/judging'}>
              <button className={styles.schedule_button}>
                Read on the process
                <LuArrowUpRight size={23} />
              </button>
            </Link>
          </div>
          <Image
            src={judge_bunny_and_ducky}
            alt="judge bunny and ducky"
            className={styles.judge_bunny_ducky_img}
          />
        </div>
      </div>
    </div>
  );
}
