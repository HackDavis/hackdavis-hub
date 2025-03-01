import styles from './Ready.module.scss';
import cow_tada from '@public/hackers/cow_tada_ready.svg';
import froggy from '@public/hackers/froggy_ready.svg';
import Image from 'next/image';

export default function Ready() {
  return (
    <div className={styles.container}>
      <div>
        <p>FEEL FREE TO REFER TO THIS ANYTIME THROUGHOUT THE HACKATHON.</p>
        <h3>We’re here to help you succeed!</h3>
      </div>
      <div className={styles.judges}>
        <Image src={cow_tada} alt="cow" className={styles.img} />
        <Image src={froggy} alt="froggy" className={styles.img} />
      </div>
    </div>
  );
}
