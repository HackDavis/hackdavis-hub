import styles from './Scroll.module.scss';
// import Image from 'next/image';

export default function Scroll() {
  return (
    <div className={styles.container}>
      <p>star</p>
      <div className={styles.parent}>
        <div className={styles.child}>
          <p>icon</p>
          <p>animals</p>
        </div>
        <div className={styles.child}>
          <p>icon</p>
          <p>animals</p>
        </div>
        <div className={styles.child}>
          <p>icon</p>
          <p>animals</p>
        </div>
        <div className={styles.child}>
          <p>icon</p>
          <p>animals</p>
        </div>
      </div>
      <p>SCROLL</p>
    </div>
  );
}
