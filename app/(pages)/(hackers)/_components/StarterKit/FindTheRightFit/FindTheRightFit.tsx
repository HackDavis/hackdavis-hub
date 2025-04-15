import StarterKitSlide from "../StarterKitSlide";
import styles from "./FindTheRightFit.module.scss";
import Animals from "public/hackers/mvp/PeepingAnimals.svg";
import Image from "next/image";

const questions = [
  {
    text: "IS THIS PERSON PASSIONATE ABOUT THE SAME TRACK(S)?",
    color: styles.qboxBlue,
  },
  {
    text: "DOES THIS PERSON’S SKILLS COMPLIMENT MINE?",
    color: styles.qboxYellow,
  },
  {
    text: "CAN I SEE MYSELF WORKING WITH THEM FOR 24 HOURS?",
    color: styles.qboxGreen,
  },
];

export default function FindTheRightFit() {
  return (
    <StarterKitSlide subtitle="GUIDING QUESTIONS TO" title="Find the Right Fit">
      <div className={styles.Container}>
        <div className={styles.questions}>
          <h3>Ask yourself questions like...</h3>
          <div className={styles.questionBoxes}>
            {questions.map((q, index) => (
              <div key={index} className={`${styles.qbox} ${q.color}`}>
                <p>{q.text}</p>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.animalcontainer}>
          <Image
            src={Animals}
            alt="Animals Peeping Behind Wall"
            className={styles.peepingAnimals}
            fill={true}
          />
        </div>
      </div>
    </StarterKitSlide>
  );
}
