import styles from "./Brainstorm.module.scss";
// import cow from '@public/hackers/cow_brainstorm.svg';
// import froggy from '@public/hackers/froggy_brainstorm.svg';
import cowAndFroggy from "@public/hackers/cow_and_froggy.svg";
import microphone from "@public/hackers/microphones.svg";
import Image from "next/image";

export default function Brainstorm() {
  return (
    <div className={styles.container}>
      <h3>Ask yourself questions like... </h3>
      <br />
      <div className={styles.questions}>
        <div className={styles.problem}>
          <p>WHAT PROBLEM ARE YOU SOLVING FOR?</p>
        </div>
        <div className={styles.user}>
          <p>WHO ARE YOUR USERS? WHAT ARE THEIR PAIN POINTS?</p>
        </div>
        <div className={styles.solution}>
          <p>WHAT MAKES YOUR SOLUTION UNIQUE?</p>
        </div>
      </div>
      <div className={styles.judges}>
        {/* <Image src={cow} alt="judge bunny" className={styles.img} />
        <Image src={froggy} alt="judge ducky" className={styles.img} /> */}
        <Image src={cowAndFroggy} alt="cow and froggy" className={styles.img} />
      </div>
      <div>
        <Image
          src={microphone}
          alt="microphones"
          className={styles.micrphones}
        />
      </div>
    </div>
  );
}
