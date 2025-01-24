import { Card, CardContent } from '@globals/components/ui/card';
import styles from './EventPosting.module.scss'
import { HiLocationMarker } from "react-icons/hi";

interface EventPostingProps {
  location: string;
  time: string;
  description: string;
}

export default function EventPosting({
  time,
  location,
  description,
}: EventPostingProps) {
  return (
    <div className={styles.EventContainer}>
        <div className={styles.EventInfoContainer}>
            <div className={styles.EventInfo}>
                {time}
            </div>
            <div className={styles.EventInfo}>
                <HiLocationMarker className={styles.icon}/>
            </div>
            <div className={styles.EventInfo}>
                {location}
            </div>
        </div>

        <p> {description} </p>
    </div>
    // <Card className="tw-h-fit tw-p-4 tw-bg-transparent">
    //   <CardContent className="tw-p-4">
    //     <p className="tw-text-sm tw-font-jakarta tw-tracking-[0.02em]">
    //       {location}
    //     </p>
    //     <h2 className="tw-text-2xl tw-font-bold tw-font-metropolis tw-tracking-[0.02em] tw-mb-4">
    //       {title}
    //     </h2>
    //     {children}
    //   </CardContent>
    // </Card>
  );
}
