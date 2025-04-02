import styles from './DemoTime.module.scss';
import hackathon from '@public/hackers/project-info/hackathon.svg';
import Image from 'next/image';

export default function DemoTime() {
  return (
    <div className={styles.container}>
      {/* TIMELINE */}
      <div className={styles.panel}>
        <div className={styles.left_panel}>TIMELINE</div>
        <div
          className={styles.right_panel}
          style={{ backgroundColor: '#AFD157' }}
        >
          <h3>You will not be visited by a judge in EVERY round.</h3>
          <p>
            <b>Why do some teams get more judges? Isn’t it unfair?</b> <br />
            Some tracks are judged by MLH, partner NPOs, or sponsors selecting
            their own winners. If your team hasn’t chosen these tracks, you’ll
            be judged by the standard three judges. Extra judges from these
            groups won’t affect your chances in other tracks, so having more
            than three judges doesn’t give an advantage or disadvantage.
          </p>
          <p>MLH = Major League Hacking</p>
          <p>NPO = Non-Profit Organizations</p>
        </div>
      </div>
      <br />
      <div className={styles.panel}>
        <div className={styles.left_panel} />
        <div
          className={styles.right_panel}
          style={{ backgroundColor: '#AFD157' }}
        >
          <h3>You will not be visited by a judge in EVERY round.</h3>
          <p>
            <b>Why do some teams get more judges? Isn’t it unfair?</b> <br />
            Some tracks are judged by MLH, partner NPOs, or sponsors selecting
            their own winners. If your team hasn’t chosen these tracks, you’ll
            be judged by the standard three judges. Extra judges from these
            groups won’t affect your chances in other tracks, so having more
            than three judges doesn’t give an advantage or disadvantage.
          </p>
          <p>MLH = Major League Hacking</p>
          <p>NPO = Non-Profit Organizations</p>
        </div>
      </div>
      <br />

      {/* JUDGES */}
      <div className={styles.panel}>
        <div className={styles.left_panel}>JUDGES</div>
        <div
          className={styles.right_panel}
          style={{ backgroundColor: '#9EE7E5' }}
        >
          <h3>You will not be visited by a judge in EVERY round.</h3>
          <p>
            <b>Why do some teams get more judges? Isn’t it unfair?</b> <br />
            Some tracks are judged by MLH, partner NPOs, or sponsors selecting
            their own winners. If your team hasn’t chosen these tracks, you’ll
            be judged by the standard three judges. Extra judges from these
            groups won’t affect your chances in other tracks, so having more
            than three judges doesn’t give an advantage or disadvantage.
          </p>
          <p>MLH = Major League Hacking</p>
          <p>NPO = Non-Profit Organizations</p>
        </div>
      </div>
      <br />
      <div className={styles.panel}>
        <div className={styles.left_panel} />
        <div
          className={styles.right_panel}
          style={{ backgroundColor: '#9EE7E5' }}
        >
          <div className={styles.be_at_table}>
            <div>
              <h3>Please be at your table during demo time.</h3>
              <p>
                If your team isn't at your table when a judge arrives, they will
                mark you as missing and move on, placing your team at the{' '}
                <b>end of their queue.</b> Please track your position to avoid
                delays.
              </p>
              <p>
                If marked missing, an announcement will be made, and a HackDavis
                director will look for you. Teams repeatedly missing or
                unreachable will be <b>removed from all judge queues.</b>
              </p>
            </div>
            <Image src={hackathon} alt="hackathon" />
          </div>
        </div>
      </div>
      <br />

      {/* POST */}
      <div className={styles.panel}>
        <div className={styles.left_panel}>POST DEMO</div>
        <div
          className={styles.right_panel}
          style={{ backgroundColor: '#FFC5AB' }}
        >
          <h3>You will not be visited by a judge in EVERY round.</h3>
          <p>
            <b>Why do some teams get more judges? Isn’t it unfair?</b> <br />
            Some tracks are judged by MLH, partner NPOs, or sponsors selecting
            their own winners. If your team hasn’t chosen these tracks, you’ll
            be judged by the standard three judges. Extra judges from these
            groups won’t affect your chances in other tracks, so having more
            than three judges doesn’t give an advantage or disadvantage.
          </p>
          <p>MLH = Major League Hacking</p>
          <p>NPO = Non-Profit Organizations</p>
        </div>
      </div>
    </div>
  );
}
