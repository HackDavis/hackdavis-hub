import Image from 'next/image';
// import Countdown from './Countdown';
import styles from './IndexHeroContentDone.module.scss';
import MusicPlayer from './MusicPlayer';
import star_icon from '@public/hackers/hero/star.svg';
import judge_bunny_and_ducky from '@public/hackers/hero/judge_bunny_and_ducky.svg';
import Scroll from './Scroll';
import { LuArrowUpRight } from 'react-icons/lu';
// import Map from '@pages/judges/(app)/map/_components/Map/Map';
import star from 'public/index/hero/star.svg';
// import NextSchedule from './NextSchedule';
import Link from 'next/link';
import TimeTracker from './TimeTracker';
import Notifications from './Notifications';
// import AssigningJudges from './AssigningJudges';
import DoneJudging from './DoneJudging';
// import Announcements from './Announcements';
// import TimeProtectedDisplay from '@pages/_components/TimeProtectedDisplay/TimeProtectedDisplay';

export default function IndexHeroContentDone() {
  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        <div className={styles.heading_split}>
          <p className={styles.date}>
            APRIL 19-20
            <br />
            2025
          </p>
          <a href="/map" className={styles.link}>
            <p className={styles.map}>ARC BALLROOM MAP</p>
            <LuArrowUpRight size={23} />
          </a>
        </div>
        <div>
          <Notifications />
        </div>
      </div>

      <div className={styles.spacer_star_container}>
        <Image src={star} alt="star" className={styles.spacer_star} />
      </div>

      <div className={styles.star_social_good}>
        <div className={styles.star_box}>
          <Image src={star} alt="star" className={styles.box_star} />
        </div>
        <div className={styles.social_good}>{'// for social good'}</div>
      </div>

      <MusicPlayer />
      <div className={styles.center_right}>
        <p>UNTIL HACKATHON BEGINS</p>
        <DoneJudging />
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
          <div>
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
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Image
              src={judge_bunny_and_ducky}
              alt="judge bunny and ducky"
              className={styles.judge_bunny_ducky_img}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
