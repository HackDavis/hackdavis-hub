import styles from './Mentor.module.scss';
import judge_bunny from '@public/hackers/judge_bunny_sitting.svg';
import judge_ducky from '@public/hackers/judge_ducky_sitting.svg';
import Image from 'next/image';
import Link from 'next/link';

export default function Mentor() {
  return (
    <div className={styles.container}>
      <div className={styles.judges}>
        <Image src={judge_bunny} alt="judge bunny" className={styles.img} />
        <Image src={judge_ducky} alt="judge ducky" className={styles.img} />
      </div>
      <div className={styles.table}>
        <Link href="/" target="blank" className={styles.link}>
          Click Here
        </Link>
      </div>
    </div>
  );
}
