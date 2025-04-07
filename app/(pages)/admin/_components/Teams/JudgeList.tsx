import styles from './JudgeList.module.scss';
import User from '@typeDefs/user';

interface JudgeListProps {
  judges: User[];
}

export default function JudgeList({ judges }: JudgeListProps) {
  return (
    <div className={styles.container}>
      {judges.map((judge) => (
        <div key={judge._id} className={styles.judge_container}>
          {judge.name}
        </div>
      ))}
    </div>
  );
}
