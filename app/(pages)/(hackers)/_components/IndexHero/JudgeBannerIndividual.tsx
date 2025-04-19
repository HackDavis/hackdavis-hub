import { useState } from 'react';
import styles from './JudgeBannerIndividual.module.scss';
import Image from 'next/image';

type JudgeBannerIndividualProps = {
  icon: string;
  name: string;
  description: string;
  teamNumber: number;
  onDismiss: () => void;
};

export default function JudgeBannerIndividual({
  name,
  description,
  teamNumber,
  icon,
}: JudgeBannerIndividualProps) {
  const [isFinishing, setIsFinishing] = useState(false);

  const handleFinish = () => {
    setIsFinishing(true);
  };

  return (
    <div
      className={`${styles.judgeBanner} ${isFinishing ? styles.finishing : ''}`}
    >
      <Image
        src={icon}
        alt={`${name} icon`}
        width={124}
        height={124}
        className={styles.icon}
      />
      <div className={styles.info}>
        <h3>{name}</h3>
        <p>{description}</p>
      </div>
      <button
        type="button"
        className={styles.dismissButton}
        onClick={handleFinish}
      >
        {/* i have it so that when u click on this part, it blurs bc i'm not sure when you want it/how you're gonna wanan link it to backend  */}
        <h1>{teamNumber}</h1>
      </button>
    </div>
  );
}
