'use client';
import React from 'react';
import Image from 'next/image';
import { Accordion, AccordionItem as Item } from '@szhsin/react-accordion';
import styles from './FAQAccordian.module.scss';
import { CgChevronLeft } from 'react-icons/cg';
import { PiStarFourFill } from 'react-icons/pi';
// import Step1 from 'public/hackers/project-info/Step1.svg';
import Step1Overlay from 'public/hackers/project-info/Step1Overlay.svg';
import Step2Overlay from 'public/hackers/project-info/Step2Overlay.svg';
import Step3Overlay from 'public/hackers/project-info/Step3Overlay.svg';
// import Step5Overlay from 'public/hackers/project-info/Step5Overlay.svg';
import Blank from 'public/hackers/project-info/Step6.svg';
// import MusicPlayer from '../../IndexHero/MusicPlayer';
import InviteTeammates from '../InviteTeammates/InviteTeammates';
import FillOutDetails from '../FillOutDetails/FillOutDetails';
import SubmitProject from '../SubmitProject/SubmitProject';

const FAQAccordian = () => {
  const steps = [
    {
      step: 'Step 1',
      question: 'Login to Devpost',
      answer: (
        <div className={styles.stepContent}>
          {/* <Image className={styles.step1} src={Step1} alt="Step 1" /> */}
          <div className={styles.imageWrapper}>
            <Image
              src={Blank}
              alt="Primary Step 1"
              fill
              style={{ objectFit: 'contain' }}
              className={styles.primaryImage}
            />
            <Image
              src={Step1Overlay}
              alt="Overlay"
              fill
              style={{ objectFit: 'contain' }}
              className={styles.overlayImage}
            />
          </div>
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
          {/* <Image className={styles.step2} src={Step2} alt="Step 2" /> */}
          <div className={`${styles.imageWrapper} ${styles.step2}`}>
            <Image
              src={Blank} // primary image
              alt="Primary Step 1"
              fill
              style={{ objectFit: 'contain' }}
              className={styles.primaryImage}
            />
            <Image
              src={Step2Overlay} // your new overlay image
              alt="Overlay"
              fill
              style={{ objectFit: 'contain' }}
              className={styles.overlayImage}
            />
          </div>
          <p>Register for the event.</p>
        </div>
      ),
    },
    {
      step: 'Step 3',
      question: 'Create a Project',
      answer: (
        <div className={styles.stepContent}>
          <div className={`${styles.imageWrapper} ${styles.step3}`}>
            <Image
              src={Blank} // primary image
              alt="Primary Step 1"
              fill
              style={{ objectFit: 'contain' }}
              className={styles.primaryImage}
            />
            <Image
              src={Step3Overlay} // your new overlay image
              alt="Overlay"
              fill
              style={{ objectFit: 'contain' }}
              className={styles.overlayImage}
            />
          </div>
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
      answer: <InviteTeammates />,
    },
    {
      step: 'Step 5',
      question: 'Step 5: Fill Out Details',
      answer: <FillOutDetails />,
    },
    {
      step: 'Step 6',
      question: 'Step 6: Submit Project',
      answer: <SubmitProject />,
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
