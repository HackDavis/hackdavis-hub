'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTeams } from '@hooks/useTeams';

import styles from './Modal.module.scss';
import mascots from 'public/index/modal/mascots_with_stars.svg';
import rightArrow from 'public/index/modal/right-arrow.svg';
import sleepingFrog from 'public/index/modal/sleeping_frog.svg';
import topRightArrow from 'public/index/modal/top-right-arrow.svg';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MODAL_COMPLETED_KEY = 'hackdavis-modal-completed';

export default function Modal({ isOpen, onClose }: ModalProps) {
  const [currentStage, setCurrentStage] = useState(1);
  const [teamNumber, setTeamNumber] = useState('');
  const [searchTeamNumber, setSearchTeamNumber] = useState<number | null>(null);
  const [isError, setIsError] = useState(false);
  const [foundTeam, setFoundTeam] = useState<any>(null);
  const [canLeaveStage2, setCanLeaveStage2] = useState(false);

  useEffect(() => {
    if (currentStage === 2) {
      setCanLeaveStage2(false);
      const timer = setTimeout(() => {
        setCanLeaveStage2(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [currentStage]);

  const query = useMemo(
    () => (searchTeamNumber ? { teamNumber: searchTeamNumber } : {}),
    [searchTeamNumber]
  );

  const { teams, loading } = useTeams(query);

  useEffect(() => {
    if (searchTeamNumber === null) return;

    if (currentStage === 1) {
      setCurrentStage(2);
      return;
    }

    if (currentStage === 2 && !loading && canLeaveStage2) {
      if (teams && teams.length > 0) {
        const exactMatch = teams.find(
          (team) => team.teamNumber === searchTeamNumber
        );

        if (exactMatch) {
          setFoundTeam(exactMatch);
          setCurrentStage(3);
        } else {
          console.log('No exact match found:', searchTeamNumber, teams);
          setIsError(true);
          setSearchTeamNumber(null);
          setCurrentStage(1);
        }
      } else {
        setIsError(true);
        setSearchTeamNumber(null);
        setCurrentStage(1);
      }
    }
  }, [loading, teams, searchTeamNumber, currentStage, canLeaveStage2]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 5);
    setTeamNumber(value);
    setIsError(false);
  };

  const handleSubmitTeam = () => {
    const inputNumber = parseInt(teamNumber);

    setIsError(false);
    setFoundTeam(null);
    setSearchTeamNumber(inputNumber);
  };

  const handleYesClick = () => {
    // Save to localStorage that the user has completed the modal flow
    if (typeof window !== 'undefined') {
      localStorage.setItem(MODAL_COMPLETED_KEY, 'true');
    }
    onClose();
  };

  const handleWrongTeam = () => {
    setCurrentStage(1);
    setSearchTeamNumber(null);
    setTeamNumber('');
    setIsError(false);
    setFoundTeam(null);
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
                className={`${styles.input} ${isError ? styles.error : ''}`}
                value={teamNumber}
                onChange={handleInputChange}
                maxLength={5}
              />
              <button
                className={`${styles.button} ${
                  isButtonActive ? styles.active : ''
                }`}
                disabled={!isButtonActive}
                onClick={handleSubmitTeam}
              >
                See my teammates!
                <Image src={rightArrow} alt="right arrow" />
              </button>
            </div>
            {isError && (
              <p className={styles.errorText}>
                Team not found. Please check your team number.
              </p>
            )}
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
        {currentStage === 3 && foundTeam && (
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
              <div className={styles.tableNumber}>{foundTeam.tableNumber}</div>
            </div>
            <div className={styles.inputContainer}>
              <input
                type="text"
                className={styles.input}
                value={teamNumber}
                readOnly
              />
              <button className={styles.secondButton} onClick={handleYesClick}>
                Yes!
                <Image src={rightArrow} alt="right arrow" />
              </button>
            </div>
            <button
              className={styles.wrongTeamButton}
              onClick={handleWrongTeam}
            >
              Wait! This is not my team
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
