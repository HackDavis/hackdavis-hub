// import { Card, CardContent } from '@globals/components/ui/card';
// interface WorkshopSlidesProps {
//   subtitle: string;
//   title: string;
//   children: React.ReactNode;
// }

import StarterKitSlide from '../StarterKitSlide';
import styles from './FindATeam.module.scss';
// import Image from 'next/image';

export default function FindATeam() {
  return (
    <div>
      {' '}
      {/* Add a wrapper div */}
      <StarterKitSlide
        subtitle="GUIDING THE QUESTIONS"
        title="Finding the right fit"
      >
        <div className={styles.Container}></div>
      </StarterKitSlide>
    </div>
  );
}
