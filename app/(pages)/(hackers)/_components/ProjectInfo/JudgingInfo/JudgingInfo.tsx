'use client';

import ProjectInfoAccordion, {
  AccordionItemInt,
} from '../ProjectInfoAccordion/ProjectInfoAccordion';
import SubmissionDue from './JudgingSteps/SubmissionDue/SubmissionDue';
import ImportantAnnouncement from './JudgingSteps/ImportantAnnouncement/ImportantAnnouncement';
import DemoTime from './JudgingSteps/DemoTime/DemoTime';
import Break from './JudgingSteps/Break/Break';
import ClosingCeremony from './JudgingSteps/ClosingCeremony/ClosingCeremony';
import ResourceHelp from '../../StarterKit2025/Resources/ResourceHelp';
import StarterKitSlide from '../../StarterKit2025/StarterKitSlide';
import styles from './JudgingInfo.module.scss';

const accordionItems: AccordionItemInt[] = [
  {
    subtitle: '11:00 AM',
    title: 'Submission Due',
    content: <SubmissionDue />,
  },
  {
    subtitle: '11:30 - 12:00 AM',
    title: 'Team Number vs Table Number',
    content: <ImportantAnnouncement />,
  },
  {
    subtitle: '12:00 - 2:00 PM',
    title: 'Demo Time',
    content: <DemoTime />,
  },
  {
    subtitle: '2:00 - 3:00 PM',
    title: 'Break',
    content: <Break />,
  },
  {
    subtitle: '3:00 - 4:00 PM',
    title: 'Closing Ceremony',
    content: <ClosingCeremony />,
  },
];

export default function JudgingInfo() {
  return (
    <div id="judging" className={styles.container}>
      <div className={styles.judgingProcess}>
        <h6>THIS IS OUR</h6>
        <h4>Judging Process</h4>
      </div>
      <ProjectInfoAccordion accordionItems={accordionItems} />
      <div className={styles.footer}>
        <StarterKitSlide
          title="You're Ready!"
          subtitle="AND NOW"
          route="project-info"
        >
          <ResourceHelp />
        </StarterKitSlide>
      </div>
    </div>
  );
}
