// import { Card, CardContent } from '@globals/components/ui/card';
// interface WorkshopSlidesProps {
//   subtitle: string;
//   title: string;
//   children: React.ReactNode;
// }

import styles from "./WorkshopSlides.module.scss";
import Image from "next/image";
import Garage from "public/hackers/garage.svg";
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
            src="https://docs.google.com/presentation/d/e/2PACX-1vRwPegDb3tMoSINsOSQiDCdoC35qx6gojknjaKE1QyyFwjPVnGUAGB5jKtbsXT-F1paps4rOcr7gjWg/embed?start=false&loop=false&delayms=3000"
            className={styles.Slides}
          ></iframe>
        </div>
      </div>
    </div>
  );
}
