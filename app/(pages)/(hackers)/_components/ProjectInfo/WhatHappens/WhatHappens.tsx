'use client';
import styles from './WhatHappens.module.scss';
import { useState } from 'react';

export default function WhatHappens() {
  const [activeTab, setActiveTab] = useState<'submission' | 'judging'>(
    'submission'
  );

  return (
    <div className={styles.container}>
      <h4>What happens during the...</h4>

      <div>
        <button onClick={() => setActiveTab('submission')}>
          Submission Process
        </button>
        <button onClick={() => setActiveTab('judging')}>Judging Process</button>
      </div>

      {/* Conditionally render the content */}
      <div>
        {activeTab === 'submission' && (
          <section>
            <h1>Submission info here</h1>
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
