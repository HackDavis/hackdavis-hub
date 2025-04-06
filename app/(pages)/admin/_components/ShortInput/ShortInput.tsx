'use client';
import styles from './ShortInput.module.scss';

interface ShortInputProps {
  label: string;
  value: string | number;
  type: 'text' | 'number';
  updateValue?: (value: any) => void;
  disabled?: boolean;
  required?: boolean;
}

export default function ShortInput({
  label,
  value,
  type,
  updateValue = () => {},
  disabled,
  required,
}: ShortInputProps) {
  return (
    <div className={styles.container}>
      <label className={styles.label}>{label}</label>
      <input
        type={type}
        value={value ?? ''}
        onChange={(event) =>
          type === 'number'
            ? updateValue(Number.parseFloat(event.target.value))
            : updateValue(event.target.value)
        }
        disabled={disabled}
        required={required}
        style={{ cursor: disabled ? 'not-allowed' : 'text' }}
      />
    </div>
  );
}
