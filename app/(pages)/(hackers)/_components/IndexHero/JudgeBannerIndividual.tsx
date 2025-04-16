import { useState } from 'react';
import styles from './JudgeBannerIndividual.module.scss';

type JudgeBannerIndividualProps = {
  name: string;
  description: string;
  teams: number;
  onDismiss: () => void;
};

export default function JudgeBannerIndividual({
  name,
  description,
  teams,
  onDismiss,
}: JudgeBannerIndividualProps) {
  const [isFinishing, setIsFinishing] = useState(false);

  const handleFinish = () => {
    setIsFinishing(true);
    setTimeout(() => {
      onDismiss();
    }, 500);
  };

  return (
    <div
      className={`${styles.judgeBanner} ${isFinishing ? styles.finishing : ''}`}
    >
      <div className={styles.info}>
        <h3>{name}</h3>
        <p>{description}</p>
      </div>
      <button
        type="button"
        className={styles.dismissButton}
        onClick={handleFinish}
      >
        <p>{teams}</p>
        Finished
      </button>
    </div>
  );
}
