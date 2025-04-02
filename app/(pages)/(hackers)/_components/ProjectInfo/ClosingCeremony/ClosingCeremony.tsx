import styles from './ClosingCeremony.module.scss';
// import Image from 'next/image';
// import Podium from 'public/hackers/project-info/ClosingCeremony.svg';

export default function ClosingCeremony() {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.textBox}>
          <h3> We made it! </h3>
          <p> If your team needs to leave before/in the middle of closing ceremony, please inform someone at the Director Table. <br/>If your team wins a prize and is not at the venue, we will contact you via email after the event to get your prize to you.</p>
        </div>
      </div>
    </>
  );
}
