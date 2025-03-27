'use client';
import React from 'react';
import Image from 'next/image';
import { Accordion, AccordionItem as Item } from '@szhsin/react-accordion';
import styles from './FAQAccordian.module.scss';
import { CgChevronLeft } from 'react-icons/cg';
import { PiStarFourFill } from 'react-icons/pi';
import Step1 from 'public/hackers/project-info/Step1.svg';
import Step2 from 'public/hackers/project-info/Step2.svg';
import Step3 from 'public/hackers/project-info/Step3.svg';
import Step4 from 'public/hackers/project-info/Step4.svg';
import Step5 from 'public/hackers/project-info/Step5.svg';
import Step6 from 'public/hackers/project-info/Step6.svg';

const FAQAccordian = () => {
  const steps = [
    {
      step: 'Step 1',
      question: 'Login to Devpost',
      answer: (
        <div className={styles.stepContent}>
          <Image className={styles.step1} src={Step1} alt="Step 1" />
          <p>
            When you click on the Devpost link, you should see this page. Click
            Join Hackathon. <br />
            Log in or sign up for a Devpost account if you don’t have one
            already.
          </p>
        </div>
      ),
    },
    {
      step: 'Step 2',
      question: 'Register for the Event',
      answer: (
        <div className={styles.stepContent}>
          <Image className={styles.step2} src={Step2} alt="Step 2" />
          <p>Register for the event.</p>
        </div>
      ),
    },
    {
      step: 'Step 3',
      question: 'Create a Project',
      answer: (
        <div className={styles.stepContent}>
          <Image className={styles.step3} src={Step3} alt="Step 3" />
          <p>
            Click Create project. Only one person per team has <br />
            to create a project and complete the next steps.
          </p>
        </div>
      ),
    },
    {
      step: 'Step 4',
      question: 'Invite Teammates',
      answer: (
        <div className={styles.stepContent}>
          <Image className={styles.step4} src={Step4} alt="Step 4" />
          <p>Invite teammates.</p>
        </div>
      ),
    },
    {
      step: 'Step 5',
      question: 'Step 5: Fill Out Details',
      answer: (
        <div className={styles.stepContent}>
          <Image className={styles.step5} src={Step5} alt="Step 5" />
        </div>
      ),
    },
    {
      step: 'Step 6',
      question: 'Step 6: Submit Project',
      answer: (
        <div className={styles.stepContent}>
          <Image className={styles.step6} src={Step6} alt="Step 6" />
          <p>Submit project.</p>
        </div>
      ),
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

export default FAQAccordian;
