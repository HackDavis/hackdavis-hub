import { useState } from 'react';
import styles from './JudgeBannerIndividual.module.scss';

type JudgeBannerIndividualProps = {
  name: string;
  description: string;
  teams: number;
  icon?: React.ReactNode;
  onDismiss: () => void;
};

export default function JudgeBannerIndividual({
  name,
  description,
  teams,
  icon,
}: JudgeBannerIndividualProps) {
  const [isFinishing, setIsFinishing] = useState(false);

  const handleFinish = () => {
    // Trigger the blur effect.
    setIsFinishing(true);
    // Do not call onDismiss so the component doesn't disappear.
    // If you need to call any callback, you can do so here without removing the component.
  };

  return (
    <div
      className={`${styles.judgeBanner} ${isFinishing ? styles.finishing : ''}`}
    >
      {/* <Image src={icon} alt="star" className={styles.box_star} /> */}
      {icon && <span className={styles.icon}>{icon}</span>}

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
        <h1>{teams}</h1>
      </button>
    </div>
  );
}
