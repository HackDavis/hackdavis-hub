'use client';

import Image from 'next/image';
import TeamVsTableSpeechBubble from 'public/hackers/project-info/teamVsTableSpeech.svg';
import TeamVsTableNumber from 'public/hackers/project-info/teamVsTableNumber.png';
import GreenSign from 'public/hackers/project-info/greenSign.svg';
import BlueSign from 'public/hackers/project-info/blueSign.svg';
import styles from './ImportantAnnouncement.module.scss';

const topInfo = [
  <p key="1">
    Team numbers will be available on <span>Devpost</span>
  </p>,
  <p key="2">
    Each team member MUST input their team number on <span>HackerHub</span>
  </p>,
];

const bottomInfo = [
  <p key="1">
    HackerHub will provide you with a <span>table number</span> (NOT the same as
    your team number)
  </p>,
  <p key="2">
    Use this table number (NOT your team number) to find your table for demos
  </p>,
  <p key="3">
    Contact a HackDavis director if you and your team are not seeing the same
    table number
  </p>,
];

export default function ImportantAnnouncement() {
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.speech_bubble}>
          <Image
            src={TeamVsTableSpeechBubble}
            alt="Team Number vs. Table Number"
          />
        </div>
        <div className={styles.characters}>
          <Image src={TeamVsTableNumber} alt="Bunny and Ducky" />
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.info_box}>
          {topInfo.map((info, index) => (
            <div key={index}>
              <Image src={GreenSign} alt="Green sign" />
              {info}
            </div>
          ))}
        </div>
        <div className={styles.info_box}>
          {bottomInfo.map((info, index) => (
            <div key={index}>
              <Image src={BlueSign} alt="Blue sign" />
              {info}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
