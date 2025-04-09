'use client';

import Image from 'next/image';
import FroggyFace from 'public/hackers/project-info/froggyFace.svg';
import CowFace from 'public/hackers/project-info/cowFace.svg';
import DuckyFace from 'public/hackers/project-info/duckyFace.svg';
import HackathonCharacters from 'public/hackers/project-info/hackathonCharacters.svg';
import styles from './DemoTimeComponents.module.scss';

export function TimelineTile1() {
  return (
    <div className={styles.timeline_tile_1}>
      <h2>Here is a breakdown of the 2 hour demo time.</h2>
      <div className={styles.breakdown}>
        <div className={styles.judges}>
          {[1, 2, 3].map((number) => (
            <div key={number} className={styles.judge}>
              <div className={styles.label}>
                <p>JUDGE {number}</p>
              </div>
              <div className={styles.range} />
              <div className={styles.text} style={{ color: '#173A52' }}>
                <p>
                  <span>3 MINS</span> of demo <br />
                  <span>3 MINS</span> of Q&amp;A
                </p>
              </div>
            </div>
          ))}
          <div className={styles.judge}>
            <div className={styles.label}>
              <p>JUDGE 4+</p>
            </div>
            <div className={styles.range} />
            <div className={styles.text} style={{ color: '#005271' }}>
              <p>
                MLH/NPO/
                <wbr />
                SPONSOR REP if applicable
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.breakdown_mobile}>
        <div className={styles.section}>
          <div className={styles.text}>
            <p>
              <span>3 MINS</span> of demo <br />
              <span>3 MINS</span> of Q&amp;A
            </p>
          </div>
          <div className={styles.bracket} />
          <div className={styles.judges}>
            <div className={styles.judge}>
              <p>JUDGE 1</p>
            </div>
            <div className={styles.judge}>
              <p>JUDGE 2</p>
            </div>
            <div className={styles.judge}>
              <p>JUDGE 3</p>
            </div>
          </div>
        </div>
        <div className={styles.section}>
          <div className={styles.text}>
            <p>
              MLH/NPO/
              <wbr />
              SPONSOR REP if applicable
            </p>
          </div>
          <div className={styles.bracket} />
          <div className={styles.judges}>
            <div className={styles.judge}>
              <p>JUDGE 4+</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TimelineTile2() {
  return (
    <div className={styles.timeline_tile_2}>
      <h2>You will not be visited by a judge in EVERY round. </h2>
      <p>
        <span>Why do some teams get more judges? Isn&apos;t it unfair?</span>
        <br />
        Some tracks are judged by MLH, partner NPOs, or sponsors selecting their
        own winners. If your team hasn&apos;t chosen these tracks, you&apos;ll
        be judged by the standard three judges. Extra judges from these groups
        won&apos;t affect your chances in other tracks, so having more than
        three judges doesn&apos;t give an advantage or disadvantage.
      </p>
      <div className={styles.acronyms}>
        <p>
          <span>MLH</span> = Major League Hacking
        </p>
        <p>
          <span>NPO</span> = Non-Profit Organizations
        </p>
      </div>
    </div>
  );
}

export function JudgesTile1() {
  return (
    <div className={styles.judges_tile_1}>
      <div className={styles.left}>
        <h2>We&apos;ll also show an estimate of when a team will be judged.</h2>
        <p>
          Please note that these are estimates. Unforeseen situations may
          <span> delay</span> or
          <span> hasten</span> a judge&apos;s arrival at your table.
        </p>
      </div>
      <div className={styles.right}>
        <div className={styles.rows}>
          <div className={styles.row}>
            <div className={styles.image_box}>
              <div className={styles.image}>
                <Image src={FroggyFace} alt="Froggy" objectFit="fill" />
              </div>
            </div>
            <div className={styles.label}>
              <p>You&apos;re 4th in line for this judge</p>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.image_box}>
              <div className={styles.image}>
                <Image src={CowFace} alt="Cow" objectFit="fill" />
              </div>
            </div>
            <div className={styles.label}>
              <p>You&apos;re 7th in line for this judge</p>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.image_box}>
              <div className={styles.image}>
                <Image src={DuckyFace} alt="Ducky" objectFit="fill" />
              </div>
            </div>
            <div className={styles.label}>
              <p>You&apos;re 10th in line for this judge</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function JudgesTile2() {
  return (
    <div className={styles.judges_tile_2}>
      <div className={styles.left}>
        <h2>Please be at your table during demo time.</h2>
        <p>
          If your team isn't at your table when a judge arrives, they will mark
          you as missing and move on, placing your team at the{' '}
          <span>end of their queue.</span> Please track your position to avoid
          delays.
        </p>
        <p>
          If marked missing, an announcement will be made, and a HackDavis
          director will look for you. Teams repeatedly missing or unreachable
          will be <span>removed from all judge queues.</span>
        </p>
      </div>
      <div className={styles.characters}>
        <Image src={HackathonCharacters} alt="Characters" />
      </div>
    </div>
  );
}

export function PostDemoTile1() {
  return (
    <div className={styles.post_demo_tile_1}>
      <div className={styles.left}>
        <div className={styles.image}>
          <Image src={CowFace} alt="Cow" />
        </div>
        <div className={styles.label}>
          <p>Zero judges left...</p>
        </div>
      </div>
      <div className={styles.right}>
        <h2>Check out what others are up to!</h2>
        <p>
          Once your team has been judged, you're welcome to explore other demos.
          Please be mindful <span>not to interrupt judges</span> or teams
          presenting.
        </p>
        <p>
          We kindly ask that you wait 1-2 minutes after the round begins before
          visiting tables without a judge.
        </p>
        <p>
          If your team experiences any disruptions,
          <span>please report them</span> to the Director Table, and we will
          address them promptly.
        </p>
      </div>
    </div>
  );
}
