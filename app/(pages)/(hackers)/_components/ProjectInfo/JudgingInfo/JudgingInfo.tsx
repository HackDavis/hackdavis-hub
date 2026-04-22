'use client';

import { useEffect, useState } from 'react';
import ProjectInfoAccordion, {
  AccordionItemInt,
} from '../ProjectInfoAccordion/ProjectInfoAccordion';
import SubmissionDue from './JudgingSteps/SubmissionDue/SubmissionDue';
import ImportantAnnouncement from './JudgingSteps/ImportantAnnouncement/ImportantAnnouncement';
import DemoTime from './JudgingSteps/DemoTime/DemoTime';
import Break from './JudgingSteps/Break/Break';
import ClosingCeremony from './JudgingSteps/ClosingCeremony/ClosingCeremony';
import ResourceHelp from '../SubmissionInfo/SubmissionSteps/ResourceHelp';
import StarterKitSlide from '../SubmissionInfo/StarterKitSlide';
import styles from './JudgingInfo.module.scss';

const accordionItems: AccordionItemInt[] = [
  {
    id: 'submission-due',
    subtitle: '11:00 AM',
    title: 'Submission Due',
    content: <SubmissionDue />,
  },
  {
    id: 'team-vs-table',
    subtitle: '11:30 - 12:00 AM',
    title: 'Team vs Table Number',
    content: <ImportantAnnouncement />,
  },
  {
    id: 'demo-time',
    subtitle: '12:00 - 2:00 PM',
    title: 'Demo Time',
    content: <DemoTime />,
  },
  {
    id: 'break',
    subtitle: '2:00 - 3:00 PM',
    title: 'Break',
    content: <Break />,
  },
  {
    id: 'closing-ceremony',
    subtitle: '3:00 - 4:00 PM',
    title: 'Closing Ceremony',
    content: <ClosingCeremony />,
  },
];

const JUDGING_ACCORDION_SLUGS = accordionItems
  .map((item) => item.id)
  .filter((id): id is string => Boolean(id));

export default function JudgingInfo() {
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (JUDGING_ACCORDION_SLUGS.includes(hash)) {
      setOpenId(hash);
      // Wait for the accordion to expand, then scroll the item into view.
      const timeout = window.setTimeout(() => {
        document
          .getElementById(hash)
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 350);
      return () => window.clearTimeout(timeout);
    }
  }, []);

  return (
    <div id="judging" className={styles.container}>
      <div className={styles.judgingProcess}>
        <h6>THIS IS OUR</h6>
        <h4>Judging Process</h4>
      </div>
      <ProjectInfoAccordion
        accordionItems={accordionItems}
        initiallyOpenId={openId}
      />
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
