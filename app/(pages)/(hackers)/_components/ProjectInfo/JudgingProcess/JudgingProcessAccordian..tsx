'use client';
import React from 'react';
import Image from 'next/image';
import { Accordion, AccordionItem as Item } from '@szhsin/react-accordion';
import styles from './JudgingProcessAccordian.module.scss';
import { CgChevronLeft } from 'react-icons/cg';
import { PiStarFourFill } from 'react-icons/pi';
// import Step1 from 'public/hackers/project-info/Step1.svg';
// import Step2 from 'public/hackers/project-info/Step2.svg';
// import Step3 from 'public/hackers/project-info/Step3.svg';
import Step4 from 'public/hackers/project-info/Step4.svg';
import Step5 from 'public/hackers/project-info/Step5.svg';
import DemoTime from '../DemoTime/DemoTime';
import SubmissionDue from '../SubmissionDue/SubmissionDue';
import ImportantAnnouncement from '../ImportantAnnouncement/ImportantAnnouncement';
import ClosingCeremony from '../ClosingCeremony/ClosingCeremony';

const JudgingProcessAccordian = () => {
  const steps = [
    {
      step: '11:00 AM',
      question: 'Submission Due',
      answer: <SubmissionDue />,
    },
    {
      step: '11:00-11:30 AM',
      question: 'Important Announcement',
      answer: <ImportantAnnouncement />,
    },
    {
      step: '11:30 - 1:30 PM',
      question: 'Demo Time',
      answer: <DemoTime />,
    },
    {
      step: '1:30 - 2:30 PM',
      question: 'Break',
      answer: (
        <div className={styles.stepContent}>
          <Image className={styles.step4} src={Step4} alt="Step 4" />
          <p>Invite teammates.</p>
        </div>
      ),
    },
    {
      step: '3:00 - 4:00 PM',
      question: 'Closing Ceremony',
      answer: <ClosingCeremony/>,
    },
  ];

  return (
    <div className={styles.container}>
      <Accordion transition transitionTimeout={250}>
        {steps.map(({ step, question, answer }, index) => (
          <Item
            key={index}
            header={
              <div className={styles.questionRow}>
                <div className={styles.questionItem}>
                  <PiStarFourFill />
                  <div className={styles.questionText}>
                    <h6>{step}</h6>
                    <h3>{question}</h3>
                  </div>
                  <div className={styles.plusIcons}>
                    <div className={styles.dropDownPlus}>
                      <CgChevronLeft />
                    </div>
                  </div>
                </div>
              </div>
            }
            buttonProps={{
              className: ({ isEnter }) =>
                `${styles.itemBtn} ${isEnter ? styles.itemBtnExpanded : ''} ${
                  index % 2 === 0 ? styles.even : styles.odd
                }`,
            }}
            contentProps={{ className: styles.itemContent }}
          >
            <p className={styles.answer}>{answer}</p>
          </Item>
        ))}
      </Accordion>
    </div>
  );
};

export default JudgingProcessAccordian;
