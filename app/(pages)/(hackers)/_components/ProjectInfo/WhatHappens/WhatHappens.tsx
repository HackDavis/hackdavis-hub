'use client';

import { useState, useEffect } from 'react';
import SubmissionInfo from '../SubmissionInfo/SubmissionInfo';
import JudgingInfo from '../JudgingInfo/JudgingInfo';
import styles from './WhatHappens.module.scss';

export default function WhatHappens() {
  const [activeTab, setActiveTab] = useState<'submission' | 'judging'>(
    'submission'
  );

  // Auto-switch tab based on URL hash on mount
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#judging') {
      setActiveTab('judging');
    } else if (hash === '#submission') {
      setActiveTab('submission');
    }
  }, []);

  return (
    <div className={styles.container}>
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
