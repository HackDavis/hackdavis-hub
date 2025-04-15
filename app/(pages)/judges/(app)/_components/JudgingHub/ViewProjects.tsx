import Link from 'next/link';
import styles from './ViewProjects.module.scss';

export default function ViewProjects() {
  return (
    <div className={styles.container}>
      <div className={styles.projects}>
        <h1>👋 Attention</h1>
        <p>Judging is now live. Please start making your way to the tables.</p>
        <Link href={'judges/projects'}>
          <button type="button">View Projects!</button>
        </Link>
      </div>
    </div>
  );
}
