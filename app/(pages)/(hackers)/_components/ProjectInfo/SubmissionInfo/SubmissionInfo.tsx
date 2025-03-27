import ResourceHelp from '../../StarterKit/Resources/ResourceHelp';
import StarterKitSlide from '../../StarterKit/StarterKitSlide';
import SubmissionTips from '../DevpostSubmission/SubmissionTips';
import styles from './SubmissionInfo.module.scss';
// import Image from 'next/image';

// import Animals from 'public/hackers/project-info/submissionProcess.svg';

export default function SubmissionInfo() {
  return (
    <div className={styles.container}>
      <div className={styles.submissionProcess}>
        <h6> THIS IS OUR </h6>
        <h4> Submission Process</h4>
      </div>
      <SubmissionTips />
      <StarterKitSlide title="You’re Ready!" subtitle="AND NOW">
        <ResourceHelp />
      </StarterKitSlide>
    </div>
  );
}
