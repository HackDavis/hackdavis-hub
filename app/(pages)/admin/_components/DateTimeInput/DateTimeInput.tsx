'use client';
import styles from './DateTimeInput.module.scss';

interface DateTimeInput {
  label: string;
  value: string | number;
  updateValue?: (value: any) => void;
  disabled?: boolean;
  required?: boolean;
}

export default function DateTimeInput({
  label,
  value,
  updateValue = () => {},
  disabled,
  required,
}: DateTimeInput) {
  return (
    <div className={styles.container}>
      <label className={styles.label}>{label}</label>
      <input
        type="datetime-local"
        value={value ?? ''}
        onChange={(event) => updateValue(event.target.value)}
        disabled={disabled}
        required={required}
        style={{ cursor: disabled ? 'not-allowed' : 'text' }}
      />
    </div>
  );
}
