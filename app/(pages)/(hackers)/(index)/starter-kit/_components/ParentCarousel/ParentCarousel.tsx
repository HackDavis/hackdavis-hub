'use client';

import styles from './ParentCarousel.module.scss';
import { Carousel } from '@globals/components/ui/carousel';
import Image from 'next/image';

interface ParentCarouselProps {
  title: string;
  color: string;
  children: React.ReactNode[];
  onNavigate: (direction: 'next' | 'previous') => void;
  currentIndex: number;
  totalCarousels: number;
}

export default function ParentCarousel({
  title,
  color,
  children,
  onNavigate,
  currentIndex,
  totalCarousels,
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
            <div className={styles.h2}>Starter Kit</div>
          </p>

          <Image src="/hackers/star.svg" alt="star" width={30} height={30} />
          <p className={styles.code_text}>
            A HACKDAVIS HUB
            <br />
            FOR EVERONE WHO // creates for social good
          </p>
        </div>
        <Image
          src="/hackers/good_froggie.svg"
          alt="good"
          width={255}
          height={150}
        />
      </div>
      <div className={styles.carousel}>
        <div className={styles.carousel_navi}>
          <div
            className={
              currentIndex === currentIndex ? styles.banner : styles.banner
            }
            style={{ backgroundColor: `${color}` }}
          >
            {title}
          </div>
          <div className={styles.bubbles_top}>
            {Array.from({ length: totalCarousels }).map((_, index) => (
              <div
                key={index}
                className={`${styles.bubble} ${
                  currentIndex === index ? styles.active2 : ''
                }`}
              />
            ))}
          </div>
        </div>
        <div className={styles.children}>
          <div className={styles.child_transition}>{children}</div>

          <div className={styles.navigation}>
            <button
              onClick={() => onNavigate('previous')}
              className={styles.home_button}
            >
              {currentIndex === 0 ? 'Home' : 'Back'}
            </button>
            <div className={styles.bubbles}>
              {Array.from({ length: totalCarousels }).map((_, index) => (
                <div
                  key={index}
                  className={`${styles.bubble} ${currentIndex === index ? styles.active : ''
                    }`}
                />
              ))}
            </div>
            <button
              onClick={() => onNavigate('next')}
              className={styles.next_button}
            >
              {currentIndex === totalCarousels - 1 ? 'Home' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
