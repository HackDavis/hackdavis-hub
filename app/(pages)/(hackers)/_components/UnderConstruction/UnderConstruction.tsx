import cow_tada from 'public/hackers/mvp/cow_tada.svg';
import Image from 'next/image';
import styles from './UnderConstruction.module.scss';

export default function UnderConstruction() {
  return (
    <div className={styles.container}>
      <div className={styles.cow_cont}>
        <Image src={cow_tada} alt="cow tada" className={styles.cow_img} />
      </div>
      <div>
        <h1>
          Under <br /> Construction...
        </h1>
        <p>
          Sit tight for exciting things like our <br />
          <b>Starter kit</b> or our <b>Prize Tracks</b>!
        </p>
      </div>
    </div>
  );
}
