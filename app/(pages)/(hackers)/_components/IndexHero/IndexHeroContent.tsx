import Image from 'next/image';
import Countdown from './Countdown';
import styles from './IndexHeroContent.module.scss';
import MusicPlayer from './MusicPlayer';
import star_icon from '@public/hackers/hero/star.svg';
import cow_tada from '@public/hackers/hero/cow_tada.svg';
import judge_bunny_and_ducky from '@public/hackers/hero/judge_bunny_and_ducky.svg';
import Scroll from './Scroll';
import { LuArrowUpRight } from 'react-icons/lu';
// import Map from '@pages/judges/(app)/map/_components/Map/Map';
import star from 'public/index/hero/star.svg';
import Announcement from './Announcement';
import NextSchedule from './NextSchedule';
import Link from 'next/link';
import TimeTracker from './TimeTracker';
import Notifications from './Notifications';
// import AssigningJudges from './AssigningJudges';
import DoneJudging from './DoneJudging';

export default function IndexHeroContent() {
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
        {/* <Countdown /> */}
        {/* <AssigningJudges /> */}
        <DoneJudging />
        {/* <p className={styles.info}>
          A HACKDAVIS HUB
          <br />
          FOR EVERYONE WHO
          <span className={styles.monospace}>
            {' // creates for social good'}
          </span>
        </p> */}
      </div>
      <div className={styles.spacer_star_container}>
        <Image src={star} alt="star" className={styles.spacer_star} />
      </div>
      <Scroll />
      {/* <p className={styles.notification}>
      <p className={styles.notification}>
        Hi hacker, it seems like you’re here a little early... Check back in{' '}
        <strong> later this month </strong> for more information!
        everything on home page doesnt get taken down - prizes, 
      </p> */}
      <div className={styles.group_width}>
        <div className={styles.live_now_heading}>
          <p>LIVE NOW</p>
          <Image
            src={star_icon}
            alt="star icon"
            className={styles.star_icon_img}
          />
        </div>
        <div className={styles.live_now}>
          <div className={styles.live_now_title}>
            <p>LIVE NOW</p>
          </div>
          <Announcement
            time={'10:00 AM'}
            title={'🧃 Fuel Up!'}
            description={
              'Snacks have landed in the main room! Come grab some chips, fruit, and possibly too many Capri Suns. Hydration is innovation.'
            }
            isNew={true}
          />
          <Announcement
            time={'10:00 AM'}
            title={'💻 Workshop Starting Soon'}
            description={
              '“Building Your First AI Bot (That Doesn’t Go Rogue)” starts in 10 minutes in Room B! Bring your laptop, your curiosity, and maybe a charger.'
            }
            isNew={false}
          />
          <Announcement
            time={'10:00 AM'}
            title={'⚠️ Lost & Found'}
            description={
              'Someone left AirPods, a water bottle, and what might be the dignity of a sleep-deprived coder near the front desk. Claim them before they become community property.'
            }
            isNew={false}
          />
        </div>
        <div className={styles.live_now_empty}>
          <Image src={cow_tada} alt="cow tada" className={styles.cow_img} />
          <p>NO ANNOUNCEMENTS YET, HAPPY HACKING!</p>
        </div>
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
        <NextSchedule
          title={'Team Mixer'}
          time={'11:00 - 12:00 PM'}
          location={'ARC Ballroom B'}
        />
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
