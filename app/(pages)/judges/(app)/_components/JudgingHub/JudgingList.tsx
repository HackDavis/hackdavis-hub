import styles from "./JudgingList.module.scss";

export default function JudgingList() {
  return (
    <div className={styles.container}>
      <div className={styles.top_text}>
        <h3>While you're waiting, feel free to...</h3>
        <div className={styles.options}>
          <div className={styles.box}>🔋 Charge your phone!</div>
          <div className={styles.box}>👋 Say hi to other judges!</div>
          <div className={styles.box}>🍿 Grab a snack and water!</div>
        </div>
      </div>
    </div>
  );
}
