'use client';
import styles from './ShortInput.module.scss';

interface ShortInputProps {
  label: string;
  value: string | number;
  type: 'text' | 'number';
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
  required?: boolean;
}

export default function ShortInput({
  label,
  value,
  type,
  onChange = () => {},
  disabled,
  required,
}: ShortInputProps) {
  return (
    <div className={styles.container}>
      <label className={styles.label}>{label}</label>
      <input
        type={type}
        value={value ?? ''}
        onChange={onChange}
        disabled={disabled}
        required={required}
        style={{ cursor: disabled ? 'not-allowed' : 'text' }}
      />
    </div>
  );
}
