'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './DropdownInput.module.scss';

interface DropdownInputProps {
  label: string;
  value: any;
  updateValue: (value: any) => void;
  width?: string;
  options: { option: string; value: any }[];
}

export default function DropdownInput({
  label,
  value,
  updateValue,
  width = '100%',
  options,
}: DropdownInputProps) {
  const [filter, setFilter] = useState<string | null>(null);
  const dropped = filter !== null;
  const ref = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setFilter(null);
      }
    };

    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, [setFilter]);

  const currentOption =
    value !== undefined && value !== null
      ? options.filter(({ option: _, value: val }) => val === value)?.[0]
          ?.option
      : 'No option selected';

  const filteredOptions = options.filter(({ option }) =>
    option.includes(filter ?? '')
  );

  return (
    <div className={styles.container} style={{ width }}>
      <label className={styles.label}>{label}</label>
      <input
        className={styles.input}
        type="text"
        ref={ref}
        value={filter === null ? currentOption : filter}
        onClick={() => setFilter((prev: any) => (prev === null ? '' : null))}
        onChange={(event) => setFilter(event.target.value)}
      />
      <div
        className={styles.options}
        style={{ display: dropped ? 'flex' : 'none' }}
      >
        {filteredOptions.map(({ option, value }) => (
          <div
            key={option}
            className={styles.option}
            onClick={() => updateValue(value)}
          >
            {option}
          </div>
        ))}
      </div>
    </div>
  );
}
