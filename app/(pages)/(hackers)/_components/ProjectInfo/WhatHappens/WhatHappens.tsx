'use client';
import Image from 'next/image';
import styles from './WhatHappens.module.scss';
import { useState } from 'react';
import SubmissionInfo from '../SubmissionInfo/SubmissionInfo';
import FAQAccordian from '../FAQAccordian/FAQAccordian';
import GrassDivider from 'public/hackers/project-info/GrassDivider.svg';

export default function WhatHappens() {
  const [activeTab, setActiveTab] = useState<'submission' | 'judging'>(
    'submission'
  );

  return (
    <div className={styles.container}>
      <div className={styles.containerContent}>
        <div className={styles.beginningText}>
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
                <FAQAccordian />
              </section>
            )}

            {activeTab === 'judging' && (
              <section>
                <h1>Judging info here</h1>
              </section>
            )}
          </div>
        </div>
      </div>

      <Image
        className={styles.GrassDivider}
        src={GrassDivider}
        alt="Grass Divider"
      />
    </div>
  );
}
