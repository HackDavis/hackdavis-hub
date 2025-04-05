'use client';

import styles from './RadioSelect.module.scss';
import { useState } from 'react';
import tooltipIcon from '@public/judges/scoring/tooltip_icon.svg';
import arrowDownIcon from '@public/judges/scoring/down_arrow.svg';
import Image from 'next/image';

interface RadioSelectProps {
  question: string;
  rubric: {[points : number]: string};
  initValue?: number | null;
  onChange: (value: number) => void;
}

export default function RadioSelect({
  question,
  rubric,
  initValue = null,
  onChange,
}: RadioSelectProps) {
  const [value, setValue] = useState<number | null>(initValue);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = (value: number) => {
    setValue(value);
    onChange?.(value);
  };

  return (
    <div className={styles.radio_container}>
      <div className={styles.question_container}>
        <h3 className={styles.question}>{question}</h3>
        <div
          className={styles.tooltip_container}
          onClick={() => setShowTooltip(!showTooltip)}
        >
          <Image src={tooltipIcon} alt="tooltip expand icon" />
          <Image
            src={arrowDownIcon}
            alt="tooltip collapse icon"
            style={{ visibility: showTooltip ? 'visible' : 'hidden' }}
          />
        </div>
      </div>
      <div className={styles.radio_buttons}>
        {[1, 2, 3, 4, 5].map((option) => (
          <div
            key={option}
            onClick={() => handleClick(option)}
            className={`${styles.radio_button} ${
              option === value ? styles.active : null
            }`}
          >
            {option}
          </div>
        ))}
      </div>
      {/* {showTooltip && ( */}
        <div className={`${styles.tooltip_text} ${showTooltip ? styles.expanded : ''}`}>
          {Object.entries(rubric).map(([key, value]) => (
            <p key={key}>
              <span className={styles.tooltip_key}>{key}:{' '}</span>
              {value}
            </p>
          ))}
        </div>
      {/* )} */}
    </div>
  );
}
