'use client';

interface DateTimeInputProps {
  label: string;
  value: string;
  updateValue?: (value: string) => void;
  required?: boolean;
  min?: string;
  max?: string;
}

export default function DateTimeInput({
  label,
  value,
  updateValue = () => {},
  required,
  min,
  max,
}: DateTimeInputProps) {
  const formatDateValue = (dateString: string): string => {
    if (!dateString) return '';

    if (dateString.includes('T')) {
      return dateString.substring(0, 16);
    }

    try {
      const date = new Date(dateString);
      return date.toISOString().substring(0, 16);
    } catch (error) {
      return '';
    }
  };

  return (
    <div>
      <label>{label}</label>
      <input
        type="datetime-local"
        value={formatDateValue(value)}
        onChange={(event) => updateValue(event.target.value)}
        required={required}
        min={min}
        max={max}
      />
    </div>
  );
}
