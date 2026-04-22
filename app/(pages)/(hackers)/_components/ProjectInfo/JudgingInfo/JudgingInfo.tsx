'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
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
import useHashChange from '@hooks/useHashChange';
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
  const scrollTimeoutRef = useRef<number | undefined>(undefined);

  const syncFromHash = useCallback(() => {
    const hash = window.location.hash.replace('#', '');
    if (!JUDGING_ACCORDION_SLUGS.includes(hash)) return;
    setOpenId(hash);
    if (scrollTimeoutRef.current !== undefined) {
      window.clearTimeout(scrollTimeoutRef.current);
    }
    // Wait for the accordion to remount/expand, then scroll into view.
    scrollTimeoutRef.current = window.setTimeout(() => {
      document
        .getElementById(hash)
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 350);
  }, []);

  // Run on mount to honor the initial hash.
  useEffect(() => {
    syncFromHash();
    return () => {
      if (scrollTimeoutRef.current !== undefined) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [syncFromHash]);

  // Run whenever the URL hash changes (including Next.js <Link> pushState nav).
  useHashChange(syncFromHash);

  return (
    <div id="judging" className={styles.container}>
      <div className={styles.judgingProcess}>
        <h6>THIS IS OUR</h6>
        <h4>Judging Process</h4>
      </div>
      <ProjectInfoAccordion
        key={openId ?? 'none'}
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
