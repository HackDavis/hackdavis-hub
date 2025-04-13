import styles from './NotificationIndividual.module.scss';
import notif from '@public/hackers/hero/notif.svg';
import Image from 'next/image';

export default function NotificationIndividual({name, description, onDismiss}){
  return (
    <div className={styles.container}>
      <button type="button" onClick={onDismiss} className={styles.button}>
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M1.40039 1.40002L5.00039 5.00002M8.60039 8.60002L5.00039 5.00002M5.00039 5.00002L8.60039 1.40002M5.00039 5.00002L1.40039 8.60002" stroke="#005271" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <Image src={notif} alt="notification" />
      <div>
        <h3>{name}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}