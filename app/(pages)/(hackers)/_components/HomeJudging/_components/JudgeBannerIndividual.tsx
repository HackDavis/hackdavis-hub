import styles from './JudgeBannerIndividual.module.scss';
import Image from 'next/image';

type JudgeBannerIndividualProps = {
  icon: string;
  name: string;
  teamsAhead?: number;
  description?: string;
  completed: boolean;
};

export default function JudgeBannerIndividual({
  icon,
  name,
  teamsAhead,
  description,
  completed,
}: JudgeBannerIndividualProps) {
  return (
    <div
      className={`${styles.judgeBanner} ${completed ? styles.finishing : ''}`}
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
        {teamsAhead && (
          <p>There are {teamsAhead} teams ahead of you for this judge.</p>
        )}
        {description && <p>{description}</p>}
      </div>
      <h1 className={`${completed ? styles.hidden : ''}`}>{teamsAhead}</h1>
    </div>
  );
}
