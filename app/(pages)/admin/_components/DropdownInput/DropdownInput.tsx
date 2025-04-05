'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './DropdownInput.module.scss';

interface DropdownInputProps {
  label: string;
  value: any;
  onUpdate: (value: any) => void;
  width?: string;
  options: { option: string; value: any }[];
}

export default function DropdownInput({
  label,
  value,
  onUpdate,
  width = '100%',
  options,
}: DropdownInputProps) {
  const [dropped, setDropped] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setDropped(false);
      }
    };

    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, [setDropped]);

  const currentOption =
    value !== undefined && value !== null
      ? options.filter(({ option: _, value: val }) => val === value)?.[0]
          ?.option
      : 'No option selected';

  return (
    <div className={styles.container} style={{ width }}>
      <label className={styles.label}>{label}</label>
      <div
        className={styles.input}
        ref={ref}
        onClick={() => setDropped((prev: any) => !prev)}
      >
        {currentOption}
      </div>
      <div
        className={styles.options}
        style={{ display: dropped ? 'flex' : 'none' }}
      >
        {options.map(({ option, value }) => (
          <div
            key={option}
            className={styles.option}
            onClick={() => onUpdate(value)}
          >
            {option}
          </div>
        ))}
      </div>
    </div>
  );
}
