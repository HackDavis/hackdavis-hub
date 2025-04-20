'use client';

import Image from 'next/image';
import MusicPlayer from '../../IndexHero/MusicPlayer';
import star_icon from '@public/hackers/hero/star.svg';
import judge_bunny_and_ducky from '@public/hackers/hero/judge_bunny_and_ducky.svg';
import { LuArrowUpRight } from 'react-icons/lu';
import star from 'public/index/hero/star.svg';
import Link from 'next/link';
import JudgeBanners from '../../IndexHero/JudgeBanners';
import styles from './IndexHeroContentJudging.module.scss';

export default function IndexHeroContentJudging() {
  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        <p className={styles.date}>
          APRIL 19-20
          <br />
          2025
        </p>
        <a
          href="https://drive.google.com/file/d/1l6fxi9jDKlleaStt4xXSgCjVg4dfQkjz/view?usp=sharing"
          className={styles.link}
        >
          <p className={styles.map}>VENUE MAP</p>
          <LuArrowUpRight size={23} />
        </a>
      </div>

      <div className={styles.spacer_star_container}>
        <Image src={star} alt="star" className={styles.spacer_star} />
      </div>

      <div className={styles.heroRow}>
        <MusicPlayer />
        <div className={styles.center_right}>
          <JudgeBanners />
        </div>
      </div>

      <div className={styles.star_social_good}>
        <div className={styles.star_box}>
          <Image src={star} alt="star" className={styles.box_star} />
        </div>
        <div className={styles.social_good}>{'// for social good'}</div>
      </div>

      <div className={styles.group_width}>
        <div
          style={{
            display: 'flex',
            gap: '1%',
            paddingBottom: '1%',
            alignItems: 'center',
          }}
        >
          <p>WHILE YOU WAIT, CHECK OUT OUR JUDGING INFORMATION</p>
          <Image
            src={star_icon}
            alt="star icon"
            className={styles.star_icon_img}
          />
        </div>
        <div className={styles.judge_info}>
          <div style={{ width: '50%' }}>
            <h2>
              <strong>Judging Information</strong>
            </h2>
            <Link href={'/project-info'}>
              <button className={styles.schedule_button}>
                Read on the process
                <LuArrowUpRight size={23} />
              </button>
            </Link>
          </div>
          <Image
            src={judge_bunny_and_ducky}
            alt="judge bunny and ducky"
            className={styles.judge_bunny_ducky_img}
          />
        </div>
      </div>
    </div>
  );
}
