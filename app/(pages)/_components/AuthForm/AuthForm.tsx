'use client';

import Link from 'next/link';
import Image from 'next/image';

import useAuthForm from '@hooks/useAuthForm';
import arrowRight from '@public/icons/arrow-right.svg';
import hackerStyles from './HackerAuthForm.module.scss';
import judgeStyles from './JudgeAuthForm.module.scss';

type Role = 'hacker' | 'judge';

interface FormField {
  name: string;
  type: string;
  label: string;
  placeholder?: string;
  readOnly: boolean;
}

interface AuthFormProps {
  role: Role;
  fields: FormField[];
  buttonText: string;
  linkText?: string;
  linkHref?: string;
  initialValues: Record<string, any>;
  onSubmit: (values: Record<string, any>) => Promise<any>;
  onSuccess: () => void;
}

export default function AuthForm({
  role,
  fields,
  buttonText,
  linkText,
  linkHref,
  initialValues,
  onSubmit,
  onSuccess,
}: AuthFormProps) {
  const styles = role === 'hacker' ? hackerStyles : judgeStyles;

  const {
    fields: formValues,
    errors,
    loading,
    valid,
    handleChange,
    handleSubmit,
  } = useAuthForm({
    initialValues,
    onSubmit,
    onSuccess,
  });

  const hasTypedInput = fields.some((field) => {
    if (field.type === 'checkbox') {
      return false;
    }
    const value = formValues[field.name];
    return String(value ?? '').trim().length > 0;
  });

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.top_container}>
          <div className={styles.fields}>
            {fields.map((field) => (
              <div key={field.name}>
                <div className={styles.input_container}>
                  <label htmlFor={field.name}>{field.label}</label>
                  {field.type === 'checkbox' ? (
                    <input
                      name={field.name}
                      type="checkbox"
                      checked={!!formValues[field.name]}
                      onChange={handleChange}
                      readOnly={field.readOnly}
                    />
                  ) : (
                    <input
                      name={field.name}
                      type={field.type}
                      placeholder={field.placeholder}
                      value={formValues[field.name] || ''}
                      onInput={handleChange}
                      readOnly={field.readOnly}
                      style={{
                        cursor: field.readOnly ? 'not-allowed' : 'auto',
                      }}
                    />
                  )}
                </div>
                <p className={styles.error_msg}>{errors[field.name]}</p>
              </div>
            ))}
            {linkText && (
              <Link href={linkHref ?? '/'} className={styles.forgot}>
                {linkText}
              </Link>
            )}
          </div>
        </div>

        <div className={styles.bottom_container}>
          <div className={styles.bottom}>
            <div />
            <button
              type="submit"
              disabled={loading || !valid}
              className={`${styles.submit_button} ${
                role === 'judge' && hasTypedInput ? styles.filled : null
              } ${valid ? styles.valid : null}`}
            >
              <span className={styles.submit_content}>
                {loading ? 'Checking...' : buttonText}
                {role === 'judge' ? (
                  <Image
                    src={arrowRight}
                    alt=""
                    aria-hidden="true"
                    className={styles.submit_arrow}
                  />
                ) : null}
              </span>
            </button>
          </div>
          <p className={styles.error_msg}>{errors.submit}</p>
        </div>
      </form>
    </div>
  );
}
