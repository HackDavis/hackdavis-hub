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
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Image
          src="/hackers/judge_bunny.svg"
          alt="judge bunny"
          width={184}
          height={150}
        />
        <div className={styles.header_text}>
          <p>
            SAY HI TO YOUR
            <br />
            <h2>
              Starter Kit
            </h2>
          </p>
          <Image src="/hackers/star.svg" alt="star" width={30} height={30} />
          <p>
            A HACKDAVIS HUB
            <br />
            FOR EVERONE WHO // creates for social good
          </p>
        </div>
        <Image
          src="/hackers/good_froggie.svg"
          alt="judge bunny"
          width={255}
          height={150}
        />
      </div>
      <div className={styles.carousel}>
        <div className={styles.carousel_navi}>
            <div className={styles.banner}>{title}</div>
            <button/>
        </div>
        <div className={styles.children}>
          {children}
          <div className={styles.navigation}>
            <button className={styles.home_button}>Home</button>
            <button/>
            <button className={styles.next_button}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
