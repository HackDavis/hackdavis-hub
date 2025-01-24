import { Card, CardContent } from '@globals/components/ui/card';
interface WorkshopSlidesProps {
  subtitle: string;
  title: string;
  children: React.ReactNode;
}

import styles from './WorkshopSlides.module.scss';
import Image from 'next/image';
import Garage from 'public/hackers/garage.svg'

export default function WorkshopSlides({
  title,
  subtitle,
  children,
}: WorkshopSlidesProps) {
  return (
    // <Card className="tw-h-fit tw-p-4 tw-bg-transparent">
    <div className={styles.GarageContainer}>
        <div className={styles.Garage}>
            <Image className={styles.Garage}
                src={Garage}
                alt='HackDavis Mascots playing instruments in a garage'
            />
        </div>
    </div>
  );
}
