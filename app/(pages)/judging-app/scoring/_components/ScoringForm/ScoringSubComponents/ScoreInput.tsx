import styles from './ScoreInput.module.scss';
import ScoringCard from './ScoringCard/ScoringCard';

interface ScoringInputProps {
  inputNameHeader: string;
  inputScoreNames: string[];
  setReady: (prev: any) => void;
  submission: number[];
}

export default function ScoringInput({
  inputNameHeader,
  inputScoreNames,
  setReady,
  submission,
}: ScoringInputProps) {
  return (
    <div className={styles.inputContainer}>
      <h2 className={styles.scoringTitle}>{inputNameHeader} </h2>
      {inputScoreNames.map((category, index) => (
        <ScoringCard
          categoryName={category}
          index={index + 1}
          key={index}
          setReady={setReady}
          initVal={submission[index]}
        />
      ))}
    </div>
  );
}
