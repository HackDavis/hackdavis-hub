import Image from 'next/image';
import Countdown from './Countdown';
import styles from './IndexHeroContent.module.scss';
import MusicPlayer from './MusicPlayer';
import location_icon from '@public/hackers/hero/location_icon.svg';
import star_icon from '@public/hackers/hero/star.svg';
import star from 'public/index/hero/star.svg';
import Announcement from './Announcement';

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
      {/* <p className={styles.notification}>
        Hi hacker, it seems like you’re here a little early... Check back in{' '}
        <strong> later this month </strong> for more information!
        everything on home page doesnt get taken down - prizes, 
      </p> */}
      <div className={styles.group_width}>
        <div style={{display:"flex", gap:'1%', paddingBottom:'1%'}}>
          <p>LIVE NOW</p>
          <Image src={star_icon} alt='star icon'/>
        </div>
        <div className={styles.live_now}>
          <Announcement/>
          <Announcement/>
          <Announcement/>
          <Announcement/>
          <Announcement/>
        </div>
      </div>
      
      <div className={styles.group_width}>
        <div style={{display:"flex", gap:'1%', paddingBottom:'1%'}}>
          <p>NEXT ON YOUR SCHEDULE</p>
          <Image src={star_icon} alt='star icon'/>
        </div>
        <div className={styles.notification}>
          <h2>
            <strong>Team Mixer</strong>
          </h2>
          <div className={styles.time_location}>
            <p>
              11:00 - 12:00 PM
            </p>
            <Image src={location_icon} alt="location_icon" />
            <p>ARC Ballroom B</p>
          </div>
          <div className={styles.button_cont}>
            <button className={styles.schedule_button}>View full schedule</button>
          </div>
        </div>
      </div>
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
