import styles from './InviteTeammates.module.scss';
import Image from 'next/image';
// import StarterKitSlide from '../SubmissionInfo';
// import Animals from 'public/hackers/project-info/submissionProcess.svg';
import Step4Overlay from 'public/hackers/project-info/Step4Overlay.svg';

export default function InviteTeammates() {
  return (
    <div className={styles.container}>
      <p>Invite teammates.</p>
      <Image
        src={Step4Overlay} // primary image
        alt="Animals on a beach playing instruments."
        className={styles.image}
      />
    </div>
  );
}
