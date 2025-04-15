// import { Card, CardContent } from '@globals/components/ui/card';
import styles from './EventPosting.module.scss';
import { HiLocationMarker } from 'react-icons/hi';

interface EventPostingProps {
  location: string;
  time: string;
  description: string;
  color: string; //input hex code here
}

export default function EventPosting({
  time,
  location,
  description,
  color,
}: EventPostingProps) {
  return (
    <div className={styles.EventContainer} style={{ borderColor: `${color}` }}>
      <div className={styles.EventInfoContainer}>
        <div className={styles.EventInfo}>{time}</div>
        <div className={styles.EventInfo}>
          <HiLocationMarker className={styles.icon} />
        </div>
        <div className={styles.EventInfo}>{location}</div>
      </div>

      <p> {description} </p>
    </div>
  );
}
