import styles from "./UseOurDiscord.module.scss";
import StarterKitSlide from "../StarterKitSlide";

export default function UseOurDiscordComponent() {
  return (
    <StarterKitSlide title="Use our Discord" subtitle="ALTERNATIVELY...">
      <div className={styles.teamFormation}>
        <div className={styles.leftPanel}>
          <h2>#find-a-team</h2>
        </div>
        <div className={styles.rightPanel}>
          <div className={`${styles.chatBubble} ${styles.blueBubble}`}>
            <p>Hey! Mich here :D</p>
            <br></br>
            <p>
              I’m a 3rd year Design and Communications major at UC Davis. Go
              Ags! I’m a UI/UX Designer looking to join a team of back-end
              developers. I’ve previously attended HackDavis and CalHacks, and I
              have experience in React, React Native, and HTML. Please reach out
              if you would like to team! I would also love to connect on
              LinkedIn :)
            </p>
          </div>
          <div className={`${styles.chatBubble} ${styles.greenBubble}`}>
            <p>Hi everyone!</p>
            <br></br>
            <p>
              My name is Michelle, and this is my first hackathon! I’m currently
              a 1st year Computer Science major at UC Davis, and I’m eager to
              gain experience through participating in HackDavis. I’m familiar
              with Python, C++, Java, and JS, and I’m currently looking for a
              team to join. Here’s my GitHub. Please DM me if you’d like to team
              up!
            </p>
          </div>
        </div>
      </div>
    </StarterKitSlide>
  );
}
