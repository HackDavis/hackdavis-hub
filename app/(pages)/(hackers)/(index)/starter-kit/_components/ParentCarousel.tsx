import styles from './ParentCarousel.module.scss';
import Image from 'next/image';

interface ParentCarouselProps {
  title: string;
  color: string;
  children: React.ReactNode;
}

export default function ParentCarousel({
  title,
  color,
  children,
}: ParentCarouselProps) {
  const banner = {
    // background-color: { color },
    padding: '50',
  };
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Image
          src="/hackers/judge_bunny.svg"
          alt="judge bunny"
          width={184}
          height={150}
        />

        <p>
          SAY HI TO YOUR
          <br />
          <h2>
            <b>Starter Kit</b>
          </h2>
        </p>

        <Image src="/hackers/star.svg" alt="star" width={20} height={20} />
        <p>
          A HACKDAVIS HUB
          <br />
          FOR EVERONE WHO // creates for social good
        </p>
        <Image
          src="/hackers/good_froggie.svg"
          alt="judge bunny"
          width={255}
          height={150}
        />
      </div>
      <div className={styles.carousel}>
        <div className={styles.banner}>{title}</div>
        <div className={styles.children}>
          {children}
          <div className={styles.navigation}>
            <button className={styles.home_button}>Home</button>
            <button className={styles.next_button}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
