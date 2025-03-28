'use client';

import styles from './RadioSelect.module.scss';
import { useState } from 'react';

interface RadioSelectProps {
  question: string;
  initValue?: number | null;
  onChange: (value: number) => void;
}

export default function RadioSelect({
  question,
  initValue = null,
  onChange,
}: RadioSelectProps) {
  const [value, setValue] = useState<number | null>(initValue);

  const handleClick = (value: number) => {
    setValue(value);
    onChange?.(value);
  };

  return (
    <div className={styles.radio_container}>
      <h3 className={styles.question}>{question}</h3>
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
    </div>
  );
}
