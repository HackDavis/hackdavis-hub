'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useTableNumber } from '@pages/_hooks/useTableNumber';

import stars from '@public/hackers/stars.svg';
import mascots from '@public/hackers/mascots-hanging-out.svg';
import sleepyFrog from '@public/hackers/sleeping-frog.svg';
import modalArrow from '@public/hackers/modal-arrow.svg';
import diagArrow from '@public/hackers/diag-arrow.svg';

import styles from './TableNumberCheckin.module.scss';
import useTableNumberContext from '@pages/_hooks/useTableNumberContext';

export default function TableNumberCheckin() {
  const {
    loading: localStorageLoading,
    storedValue,
    setValue,
  } = useTableNumberContext();

  const [teamNumber, setTeamNumber] = useState<string>('');
  const { loading, tableNumber, fetchTableNumber, setTableNumber, error } =
    useTableNumber();

  if (localStorageLoading || storedValue) {
    return null;
  }

  let stage: 'init' | 'loading' | 'confirm' = 'init';
  if (loading) {
    stage = 'loading';
  } else {
    stage = tableNumber ? 'confirm' : 'init';
  }

  const handleTeamNumberSubmit = () => {
    fetchTableNumber(Number(teamNumber));
  };

  const hasTeamNumber = Boolean(teamNumber);
  const inputStage = (
    <div className={styles.init_content_container}>
      <div className={styles.mascot_container}>
        <Image src={stars} alt={'floating stars'} />
        <Image
          src={mascots}
          alt={'mascots hanging out'}
          className={styles.mascots}
        />
      </div>
      <div className={styles.text_container}>
        <h3>THE HACKATHON HAS ENDED</h3>
        <p>
          Thank you for all your hard work during the past 24 hours, HackDavis
          recognizes your passion and talent. Please enter in the team number
          you received from Devpost.
        </p>
      </div>
      <div className={styles.input_container}>
        <input
          type="text"
          className={`${styles.team_input} ${error ? styles.error : null}`}
          placeholder="#####"
          value={teamNumber}
          onChange={(event) => setTeamNumber(event.target.value)}
        />
        <button
          className={styles.see_teammates_button}
          disabled={!hasTeamNumber}
          style={{ opacity: hasTeamNumber ? 1.0 : 0.3 }}
          onClick={handleTeamNumberSubmit}
        >
          See my teammates! <Image src={modalArrow} alt="" />
        </button>
      </div>
    </div>
  );

  const loadingStage = (
    <div className={styles.loading_content_container}>
      <Image src={sleepyFrog} alt={'sleepy frog'} className={styles.frog} />
      <div className={styles.text_container}>
        <h3>SEARCHING HIGH AND LOW...</h3>
        <p>
          Please wait patiently while we match you to a judging table. Btw did
          you know next year will be HackDavis's 10 year anniversary?
        </p>
      </div>
    </div>
  );

  const confirmStage = (
    <div className={styles.confirm_content_container}>
      <div className={styles.header}>
        <h1>{tableNumber}</h1>
        <div className={styles.text_container}>
          <h3>YOUR TABLE NUMBER</h3>
          <div className={styles.info_container}>
            <Link
              href={
                'https://drive.google.com/file/d/1l6fxi9jDKlleaStt4xXSgCjVg4dfQkjz/view'
              }
              target="_blank"
              className={styles.link}
            >
              Map Link{' '}
              <Image
                src={diagArrow}
                alt="arrow"
                className={styles.diag_arrow}
              />
            </Link>
            <p>
              Check that you and your team members received the same table
              number. It is extremely important to be{' '}
              <strong>present at your table</strong> when the judges arrive.
            </p>
          </div>
        </div>
      </div>
      <div className={styles.input_container}>
        <input
          type="text"
          className={styles.team_input}
          placeholder="#####"
          value={teamNumber}
          onChange={(event) => setTeamNumber(event.target.value)}
          disabled
        />
        <button
          className={styles.yes_button}
          disabled={!hasTeamNumber}
          onClick={() => setValue(tableNumber)}
        >
          Yes! <Image src={modalArrow} alt="" />
        </button>
      </div>
      <button
        className={styles.not_my_team_button}
        onClick={() => {
          setTableNumber(null);
          setTeamNumber('');
        }}
      >
        Wait! This is not my team
      </button>
    </div>
  );

  const displayMap = {
    init: inputStage,
    loading: loadingStage,
    confirm: confirmStage,
  };

  return (
    <div className={styles.background_dimmer}>
      <div className={styles.modal_container}>{displayMap[stage]}</div>
    </div>
  );
}
