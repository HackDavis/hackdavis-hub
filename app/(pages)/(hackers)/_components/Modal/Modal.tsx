'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import styles from './Modal.module.scss';
import mascots from 'public/index/modal/mascots_with_stars.svg';
import rightArrow from 'public/index/modal/right-arrow.svg';
import sleepingFrog from 'public/index/modal/sleeping_frog.svg';
import topRightArrow from 'public/index/modal/top-right-arrow.svg';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Modal({ isOpen, onClose }: ModalProps) {
  const [currentStage, setCurrentStage] = useState(3);
  const [teamNumber, setTeamNumber] = useState('');
  const [tableNumber, setTableNumber] = useState('42'); // Example table number

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 5);
    setTeamNumber(value);
  };

  const isButtonActive = teamNumber.length === 5;

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {currentStage === 1 && (
          <div className={styles.stage}>
            <div className={styles.mascots}>
              <Image src={mascots} alt="mascots" />
            </div>
            <p className={styles.heading}>THE HACKATHON HAS ENDED!</p>
            <p className={styles.subtext}>
              Thank you for all your hard work during the past 24 hours,
              HackDavis recognizes your passion and talent. Please enter in the
              team number you received from Devpost.
            </p>
            <div className={styles.inputContainer}>
              <input
                type="text"
                placeholder="#####"
                className={styles.input}
                value={teamNumber}
                onChange={handleInputChange}
                maxLength={5}
              />
              <button
                className={`${styles.button} ${
                  isButtonActive ? styles.active : ''
                }`}
                disabled={!isButtonActive}
              >
                See my teammates!
                <Image src={rightArrow} alt="right arrow" />
              </button>
            </div>
          </div>
        )}
        {currentStage === 2 && (
          <div className={styles.stage}>
            <div className={styles.frog}>
              <Image src={sleepingFrog} alt="sleeping frog" />
            </div>
            <p className={styles.secondHeading}>SEARCHING HIGH AND LOW...</p>
            <p className={styles.subtext}>
              Did you know this is HackDavis's 10 year anniversary?
            </p>
          </div>
        )}
        {currentStage === 3 && (
          <div className={styles.stage}>
            <div className={styles.tableInfoContainer}>
              <div className={styles.leftContent}>
                <h2 className={styles.tableTitle}>YOUR TABLE NUMBER</h2>
                <Link href="#" className={styles.mapLinkContainer}>
                  <span className={styles.mapLink}>Map Link</span>
                  <Image
                    src={topRightArrow}
                    alt="Open map"
                    className={styles.mapIcon}
                    width={24}
                    height={24}
                  />
                </Link>
                <p className={styles.instructions}>
                  Check that you and your team members received the same table
                  number. It is <strong>present at your table</strong> when the
                  judges arrive.
                </p>
              </div>
              <div className={styles.tableNumber}>{tableNumber}</div>
            </div>
            <div className={styles.inputContainer}>
              <input
                type="text"
                placeholder="#####"
                className={styles.input}
                value={teamNumber}
                onChange={handleInputChange}
                maxLength={5}
              />
              <button
                className={`${styles.secondButton} ${
                  isButtonActive ? styles.active : ''
                }`}
                disabled={!isButtonActive}
              >
                Yes!
                <Image src={rightArrow} alt="right arrow" />
              </button>
            </div>
            <button className={styles.wrongTeamButton}>
              Wait! This is not my team
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
