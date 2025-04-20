import styles from './DoneJudging.module.scss';
import bunny_phone from 'public/hackers/hero/bunny_phone.svg';
import stars from 'public/hackers/hero/stars.svg';
import ducky from 'public/hackers/hero/ducky.svg';
import Image from 'next/image';

export default function DoneJudging() {
  return (
    <div>
      <div className={styles.container}>
        <div className={styles.text_container}>
          <p>CONGRATS!</p>
          <br />
          <p>
            You're all done, thank you so much for your participation at
            HackDavis 2025. Please wait until <b>Closing Ceremony</b> for
            judging results! In the meantime, put in your vote for{' '}
            <a href="/" target="_blank">
              Hacker's Choice Award
            </a>{' '}
            and check out our insta <b>@hackdavis!</b>
          </p>
        </div>
        <Image src={stars} alt="stars" className={styles.stars_img} />
        <Image
          src={bunny_phone}
          alt="bunny phone"
          className={styles.bunny_phone_img}
        />
      </div>
      <div className={styles.grid_container}>
        <div className={styles.left_container}>
          <Image
            src={bunny_phone}
            alt="bunny phone"
            className={styles.bunny_phone_img_mobile}
          />
          <p className={styles.hackdavis_text}>@hackdavis</p>
          <p>Check out our instagram</p>
        </div>
        <div className={styles.right_container}>
          <Image src={ducky} alt="ducky" className={styles.ducky_img} />
        </div>
      </div>
    </div>
  );
}
