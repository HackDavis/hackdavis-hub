// import { Card, CardContent } from '@globals/components/ui/card';
// interface WorkshopSlidesProps {
//   subtitle: string;
//   title: string;
//   children: React.ReactNode;
// }

import styles from './WorkshopSlides.module.scss';
import Image from 'next/image';
import Garage from 'public/hackers/garage.svg';
// import ClosedGarage from 'public/hackers/closed_garage.svg';

export default function WorkshopSlides() {
  return (
    // <Card className="tw-h-fit tw-p-4 tw-bg-transparent">
    <div className={styles.GarageContainer}>
      <div className={styles.Garage}>
        <Image
          className={styles.Garage}
          src={Garage}
          alt="HackDavis Mascots playing instruments in a garage"
        />

        <div className={styles.Overlay}>
          <iframe
            src="https://docs.google.com/presentation/d/e/2PACX-1vSHmljU98XbyiyjBViiWGvqeWSWXKjCx_MBRBaKsb1k7YoH8dl9_wocT4DwEc4uUU8h1eRsmXa3TMqn/pubembed?start=false&loop=false&delayms=60000"
            className={styles.Slides}
          ></iframe>
        </div>
      </div>
    </div>
  );
}
