import styles from './IndexHeroContent.module.scss'; //using styling from other file....
import location_icon from '@public/hackers/hero/location_icon.svg';
import Image from 'next/image';
import Link from 'next/link';

export default function NextSchedule({title, time, location}){
    return(
        <div className={styles.notification}>
                <h2>
                    <strong>{title}</strong>
                </h2>
                <div className={styles.time_location}>
                    <p>{time}</p>
                    <Image src={location_icon} alt="location_icon" />
                    <p>{location}</p>
                </div>
                <Link href={'/schedule'}>
                    <div className={styles.button_cont}>
                        <button className={styles.schedule_button}>View full schedule</button>
                    </div>
                </Link>
                
            </div>
      );
}