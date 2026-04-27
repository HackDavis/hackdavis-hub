'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import SubmissionInfo from '../SubmissionInfo/SubmissionInfo';
import JudgingInfo from '../JudgingInfo/JudgingInfo';
import useHashChange from '@hooks/useHashChange';
import styles from './WhatHappens.module.scss';

const JUDGING_SLUGS = new Set([
  'judging',
  'submission-due',
  'team-vs-table',
  'demo-time',
  'break',
  'closing-ceremony',
]);

export default function WhatHappens() {
  const [activeTab, setActiveTab] = useState<'submission' | 'judging'>(
    'submission'
  );
  const scrollTimeoutRef = useRef<number | undefined>(undefined);

  const scheduleScrollTo = useCallback((id: string) => {
    if (scrollTimeoutRef.current !== undefined) {
      window.clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = window.setTimeout(() => {
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }, []);

  const syncTabFromHash = useCallback(() => {
    const hash = window.location.hash.replace('#', '');
    if (JUDGING_SLUGS.has(hash)) {
      setActiveTab('judging');
      scheduleScrollTo(hash);
    } else if (hash === 'submission') {
      setActiveTab('submission');
      scheduleScrollTo('submission');
    }
  }, [scheduleScrollTo]);

  // Run on mount to honor the initial hash.
  useEffect(() => {
    syncTabFromHash();
    return () => {
      if (scrollTimeoutRef.current !== undefined) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [syncTabFromHash]);

  // Run whenever the URL hash changes (including Next.js <Link> pushState nav).
  useHashChange(syncTabFromHash);

  return (
    <div id="what-happens" className={styles.container}>
      <div className={styles.containerContent}>
        <div className={styles.beginningText}>
          <div className={styles.commonHeader}>
            <h2>What happens during the...</h2>
            <div className={styles.processButtons}>
              <button
                className={activeTab === 'submission' ? styles.selected : ''}
                onClick={() => setActiveTab('submission')}
              >
                Submission Process
              </button>
              <button
                className={activeTab === 'judging' ? styles.selected : ''}
                onClick={() => setActiveTab('judging')}
              >
                Judging Process
              </button>
            </div>
          </div>

          <div>
            {activeTab === 'submission' && (
              <section>
                <SubmissionInfo />
              </section>
            )}

            {activeTab === 'judging' && (
              <section>
                <JudgingInfo />
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
