'use client';

import ProjectInfoAccordion, {
  AccordionItemInt,
} from '../ProjectInfoAccordion/ProjectInfoAccordion';
import SubmissionDue from './JudgingSteps/SubmissionDue/SubmissionDue';
import ImportantAnnouncement from './JudgingSteps/ImportantAnnouncement/ImportantAnnouncement';
import DemoTime from './JudgingSteps/DemoTime/DemoTime';
import Break from './JudgingSteps/Break/Break';
import ClosingCeremony from './JudgingSteps/ClosingCeremony/ClosingCeremony';
import styles from './JudgingInfo.module.scss';

const accordionItems: AccordionItemInt[] = [
  {
    time: '11:00 AM',
    title: 'Submission Due',
    content: <SubmissionDue />,
  },
  {
    time: '11:00 - 11:30 AM',
    title: 'Important Announcement',
    content: <ImportantAnnouncement />,
  },
  {
    time: '11:30 - 1:30 PM',
    title: 'Demo Time',
    content: <DemoTime />,
  },
  {
    time: '1:30 - 2:30 PM',
    title: 'Break',
    content: <Break />,
  },
  {
    time: '3:00 - 4:00 PM',
    title: 'Closing Ceremony',
    content: <ClosingCeremony />,
  },
];

export default function JudgingInfo() {
  return (
    <div className={styles.container}>
      <div className={styles.submissionProcess}>
        <h6>THIS IS OUR</h6>
        <h4>Judging Process</h4>
      </div>
      <ProjectInfoAccordion accordionItems={accordionItems} />
    </div>
  );
}
