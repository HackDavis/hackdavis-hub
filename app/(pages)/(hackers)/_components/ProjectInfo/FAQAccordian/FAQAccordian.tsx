'use client';
import React from 'react';
import { Accordion, AccordionItem as Item } from '@szhsin/react-accordion';
// import Image from 'next/image';
import styles from './FAQAccordian.module.scss';
import { CgChevronLeft } from 'react-icons/cg';

import { PiStarFourFill } from 'react-icons/pi';

const FAQAccordian = () => {
  // Replace the FAQ data with your desired steps/questions
  const steps = [
    {
      step: 'Step 1',
      question: 'Login to Devpost',
      answer:
        'Your first step is to create or log in to your Devpost account so you can register your project and teammates.',
    },
    {
      step: 'Step 2',
      question: 'Register for the Event',
      answer:
        'Then, register for the hackathon event on Devpost so you’re officially in our system.',
    },
    {
      step: 'Step 3',
      question: 'Create a Project',
      answer:
        'Go ahead and create a new project on Devpost. You can update your project details at any time before the deadline.',
    },
    {
      step: 'Step 4',
      question: 'Invite Teammates',
      answer:
        'If you’re working with others, make sure they join your project on Devpost so they’re recognized as contributors.',
    },
    {
      step: 'Step 5',
      question: 'Step 5: Fill Out Details',
      answer:
        'Describe your project thoroughly—what it does, how it helps, any libraries used, etc. This helps judges understand your work.',
    },
    {
      step: 'Step 6',
      question: 'Step 6: Submit Project',
      answer:
        'Finally, submit your project before the deadline! Double-check you’ve filled in all required fields.',
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
                    <h6 className={styles.questionItem}>{step}</h6>
                    <h3 className={styles.questionItem}>{question}</h3>
                  </div>

                  <div className={styles.plusIcons}>
                    {/* “Closed” plus icon (rotated) */}
                    <div className={styles.dropDownPlus}>
                      <CgChevronLeft />
                    </div>
                    {/* “Open” plus icon (normal orientation) */}
                  </div>
                </div>
              </div>
            }
            buttonProps={{
              className: ({ isEnter }) =>
                `${styles.itemBtn} ${isEnter ? styles.itemBtnExpanded : ''}`,
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
