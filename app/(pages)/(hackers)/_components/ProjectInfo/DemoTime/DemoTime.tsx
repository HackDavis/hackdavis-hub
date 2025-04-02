import styles from './DemoTime.module.scss';
import hackathon from '@public/hackers/project-info/hackathon.svg';
import cow_icon from '@public/hackers/project-info/cow_icon.svg';
import froggy_icon from '@public/hackers/project-info/froggy_icon.svg';
import ducky_icon from '@public/hackers/project-info/ducky_icon.svg';
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
          <div className={styles.estimation_group}>
            <div className={styles.estimation}>
              <h3>
                We’ll also show an estimate of when a team will be judged.
              </h3>
              <p>
                Please note that these are estimates. Unforeseen situations may
                <b>delay</b> or <b>hasten</b> a judge’s arrival at your table.
              </p>
            </div>
            <div className={styles.character_group}>
              <div className={styles.characters}>
                <Image
                  src={froggy_icon}
                  alt="froggy icon"
                  className={styles.icons}
                />
                <p className={styles.text_bubble}>
                  You’re 4th in line for this judge
                </p>
              </div>
              <br />
              <div className={styles.characters}>
                <Image src={cow_icon} alt="cow icon" className={styles.icons} />
                <p className={styles.text_bubble}>
                  You’re 7th in line for this judge
                </p>
              </div>
              <br />
              <div className={styles.characters}>
                <Image
                  src={ducky_icon}
                  alt="ducky icon"
                  className={styles.icons}
                />
                <p className={styles.text_bubble}>
                  You’re 10th in line for this judge
                </p>
              </div>
            </div>
          </div>
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
            <Image
              src={hackathon}
              alt="hackathon"
              className={styles.hackathon_img}
            />
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
          <div className={styles.post_demo}>
            <div className={styles.zero_judges_group}>
              <Image src={cow_icon} alt="cow icon" />
              <br />
              <div className={styles.no_judges}>
                <p>Zero judges left...</p>
              </div>
            </div>
            <div className={styles.check_out}>
              <h3>Check out what others are up to!</h3>
              <p>
                Once your team has been judged, you're welcome to explore other
                demos. Please be mindful <b>not to interrupt</b> judges or teams
                presenting.
              </p>
              <p>
                We kindly ask that you wait 1-2 minutes after the round begins
                before visiting tables without a judge.
              </p>
              <p>
                If your team experiences any disruptions,{' '}
                <b>please report them</b> to the Director Table, and we will
                address them promptly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
