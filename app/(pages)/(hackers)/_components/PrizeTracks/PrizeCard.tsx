'use client';
import Image from 'next/image';
import { useState } from 'react';
import styles from './PrizeCard.module.scss';
import { ChevronDown } from 'lucide-react';

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';

interface PrizeCardProps {
  name: string;
  prizeImages: StaticImport[];
  prizeNames: string[];
  criteria: string;
}

export default function PrizeCard({
  name,
  prizeImages,
  prizeNames,
  criteria,
}: PrizeCardProps) {
  const [rotateArrow, setRotateArrow] = useState<boolean>(false);

  const handleCriteriaClick = () => {
    setRotateArrow((prevState: boolean) => !prevState);
  };

  return (
    <Accordion
      sx={{
        padding: '0px',
        boxShadow: '0px 8px 24px rgba(149,157,165,0.2)',
        border: 'none',
        '&::before': {
          content: 'none',
        },
      }}
      disableGutters={true}
    >
      <AccordionSummary sx={{ padding: '0px' }}>
        <div className={styles.container} onClick={handleCriteriaClick}>
          <div className={styles.content}>
            <div className={styles.info}>
              <div>
                <h3 className={styles.header}>{name}</h3>
                <div className={styles.prizes}>
                  {prizeNames.map((prizeName, index) => (
                    <div key={index} className={styles.place}>
                      {prizeNames.length > 1 && index == 0 && (
                        <div className="flex items-center gap-2">
                          <FirstPlaceIcon />
                          <p
                            className={styles.placeText}
                          >{`1st Place: ${prizeName}`}</p>
                        </div>
                      )}
                      {prizeNames.length > 1 && index == 1 && (
                        <div className="flex items-center gap-2">
                          <SecondPlaceIcon />
                          <p
                            className={styles.placeText}
                          >{`2nd Place: ${prizeName}`}</p>
                        </div>
                      )}
                      {prizeNames.length == 1 && (
                        <div className="flex items-center gap-2">
                          <FirstPlaceIcon />
                          <p className={styles.placeText}>{prizeName}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.eligibility}>
                <ChevronDown
                  className={rotateArrow ? styles.arrow : styles.arrowRotated}
                />
                <p className={styles.eligibilityText}>ELIGIBILITY CRITERIA</p>
              </div>
            </div>
            <div className="flex gap-4">
              {prizeImages.map((image, index) => (
                <div key={index} className={styles.imageBackground}>
                  <Image
                    src={image}
                    alt={prizeNames[index]}
                    className={styles.prizeImage}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </AccordionSummary>
      <AccordionDetails sx={{ padding: '0px' }}>
        <div className={styles.criteriaContainer}>
          <p className={styles.criteriaContent}>{criteria}</p>
        </div>
      </AccordionDetails>
    </Accordion>
  );
}

function FirstPlaceIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 3H15L18 10L12 12M9 3L6 10L12 12M9 3L12 12M12 12L10.5 15L7.5 15.5L9.5 17.5L9 21L12 19.5L15 21L14.5 17.5L16.5 15.5L13.5 15L12 12ZM15 11L12 3" stroke="#5E5E65" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function SecondPlaceIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 4V7M8 4V10M16 4V10M12 18.5L9 20L9.5 16.5L7.5 14.5L10.5 14L12 11L13.5 14L16.5 14.5L14.5 16.5L15 20L12 18.5Z" stroke="#5E5E65" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
