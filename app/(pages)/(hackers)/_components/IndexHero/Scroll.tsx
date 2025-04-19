import styles from './Scroll.module.scss';
import Image from 'next/image';
import CowHead from 'public/hackers/hero/CowHead.svg';
import BunnyHead from 'public/hackers/hero/BunnyHead.svg';
import FrogHead from 'public/hackers/hero/FrogHead.svg';
import DuckHead from 'public/hackers/hero/DuckHead.svg';
import star from 'public/hackers/hero/star.svg';

// can delete scroll text
// make music notes hidden + upon hover notes go up

export default function Scroll() {
  return (
    <div className={styles.container}>
      <Image src={star} alt="Star" className={styles.star} />
      <div className={styles.parent}>
        <div className={styles.child}>
          <Image
            src={CowHead}
            alt="Cow Head"
            // className={styles.vinyl}
          />
          <p>animals</p>
        </div>
        <div className={styles.child}>
          <Image
            src={BunnyHead}
            alt="Bunny Head"
            // className={styles.vinyl}
          />
          <p>animals</p>
        </div>
        <div className={styles.child}>
          <Image
            src={FrogHead}
            alt="Frog Head"
            // className={styles.vinyl}
          />
          <p>animals</p>
        </div>
        <div className={styles.child}>
          <Image
            src={DuckHead}
            alt="Duck Head"
            // className={styles.vinyl}
          />
          <p>animals</p>
        </div>
      </div>
      <p>SCROLL</p>
    </div>
  );
}
