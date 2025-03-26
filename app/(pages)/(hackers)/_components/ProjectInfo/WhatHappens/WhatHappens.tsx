'use client';
import styles from './WhatHappens.module.scss';
import { useState } from 'react';
import SubmissionInfo from '../SubmissionInfo/SubmissionInfo';

export default function WhatHappens() {
  const [activeTab, setActiveTab] = useState<'submission' | 'judging'>(
    'submission'
  );

  return (
    <div className={styles.container}>
      <h4>What happens during the...</h4>

      <div>
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
      <div>
        {activeTab === 'submission' && (
          <section>
            <SubmissionInfo />
          </section>
        )}

        {activeTab === 'judging' && (
          <section>
            <h1>Judging info here</h1>
          </section>
        )}
      </div>
    </div>
  );
}
