import StarterKitSlide from "@pages/(hackers)/_components/StarterKit/StarterKitSlide";
import styles from "./Clarifications.module.scss";

export default function Clarifications() {
  return (
    <StarterKitSlide
      subtitle="IN CASE YOU NEED"
      title="Submission Clarifications"
      route="project-info"
    >
      <div className={styles.container}>
        <div className={styles.box}>
          <h3>
            <div className={styles.green_text}>EARLY </div> Submission
          </h3>
          <p>
            You are able to click “submit” BUT are still able to edit your
            devpost until the final submission time.
          </p>
        </div>
        <div className={styles.box}>
          <h3>
            <div className={styles.pink_text}>FINAL </div> Submission
          </h3>
          <p>
            You are NOT able to edit your devpost after the final submission
            time or you'll be disqualified.
          </p>
        </div>
      </div>
    </StarterKitSlide>
  );
}
