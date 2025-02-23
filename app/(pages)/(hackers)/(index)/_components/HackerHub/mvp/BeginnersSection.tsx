import styles from './BeginnersSection.module.scss';
import Image from 'next/image';
import hackathon from 'public/hackers/mvp/hackathon.svg';
import arrow from 'public/hackers/mvp/arrow.svg';

export default function BeginnersSection() {
  return (
    <div className={styles.container}>
      <div>
        <p>NOT SURE WHERE TO START? DON’T WORRY, WE GOT YOU :)</p>
        <h1>For beginners</h1>
        <br />
        <p>
          We’ve created a <span className={styles.p_bold}>Starter kit</span> for
          all
          <br /> beginner hackers to get their hack <br /> started! Inside
          includes: resources, <br /> past winning hacks, and more.
        </p>
      </div>
      <div className={styles.starterkit_cont}>
        <div className={styles.hackathon_cont}>
          <Image src={hackathon} alt="hackathon" />
        </div>
        <button>
          <Image src={arrow} alt="arrow" />
          TAKE ME TO THE STARTER KIT!
        </button>
      </div>
    </div>
  );
}
