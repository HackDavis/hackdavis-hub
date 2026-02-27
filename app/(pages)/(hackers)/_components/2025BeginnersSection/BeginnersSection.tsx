import styles from './BeginnersSection.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import hackathon from 'public/hackers/mvp/hackathon.svg';
import arrow from 'public/hackers/mvp/arrow.svg';
import grass_detail_light from 'public/hackers/mvp/grass_detail_light.svg';
import grass_detail_dark from 'public/hackers/mvp/grass_detail_dark.svg';

export default function BeginnersSection() {
  return (
    <div className={styles.container}>
      <div className={styles.main_content}>
        <div>
          <p className={styles.top_line}>
            NOT SURE WHERE TO START? DON'T WORRY, WE GOT YOU :)
          </p>
          <h1>For beginners</h1>
          <p className={styles.description}>
            We've created a <strong>Starter kit</strong> for all beginner
            hackers to get their hack started! Inside includes: resources, past
            winning hacks, and more.
          </p>
        </div>
        <div className={styles.hackathon_cont}>
          <div className={styles.hack_img}>
            <Image src={hackathon} alt="hackathon" fill />
            <Image
              src={grass_detail_light}
              alt="grass detail"
              className={styles.grass_light}
            />
          </div>
          <div className={styles.button}>
            <Link href="/starter-kit" className="h-full w-full">
              <button>
                <Image src={arrow} alt="arrow" />
                TAKE ME TO THE STARTER KIT!
              </button>
            </Link>
            <Image
              src={grass_detail_light}
              alt="grass detail"
              className={styles.grass_light}
            />
            <Image
              src={grass_detail_dark}
              alt="grass detail"
              className={styles.grass_dark}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
