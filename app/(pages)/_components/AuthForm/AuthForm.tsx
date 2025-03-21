'use client';

import { useEffect } from 'react';
import Link from 'next/link';

import useAuthForm from '@hooks/useAuthForm';
import styles from './AuthForm.module.scss';

type FieldName = 'email' | 'password' | 'passwordDupe';

interface FormField {
  name: FieldName;
  type: string;
  label: string;
  placeholder?: string;
  readOnly: boolean;
}

interface AuthFormProps {
  fields: FormField[];
  buttonText: string;
  linkText?: string;
  linkHref?: string;
  initialValues: Record<string, string>;
  onSubmit: (values: Record<string, string>) => Promise<any>;
  onSuccess: () => void;
}

export default function AuthForm({
  fields,
  buttonText,
  linkText,
  linkHref,
  initialValues,
  onSubmit,
  onSuccess,
}: AuthFormProps) {
  const {
    fields: formValues,
    errors,
    loading,
    valid,
    submitted,
    handleChange,
    handleSubmit,
  } = useAuthForm({
    initialValues,
    onSubmit,
  });

  useEffect(() => {
    if (!loading && !errors.submit && submitted) {
      onSuccess();
    }
  }, [loading, errors.submit, submitted, onSuccess]);

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <p className={styles.error_msg}>{errors.submit}</p>
        <div className={styles.fields}>
          {fields.map((field) => (
            <div key={field.name}>
              <p className={styles.error_msg}>{errors[field.name]}</p>
              <label htmlFor={field.name}>{field.label}</label>
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
            </div>
          ))}
        </div>

        <div className={styles.bottom}>
          {linkText ? (
            <Link href={linkHref ?? '/'} className={styles.forgot}>
              {linkText}
            </Link>
          ) : (
            <div />
          )}

          <button
            type="submit"
            disabled={loading || !valid}
            className={`${styles.login_button} ${valid ? styles.valid : null}`}
          >
            {buttonText}
          </button>
        </div>
      </form>

      {loading && (
        <div className={styles.loading_container}>
          <div className={styles.loader}></div>
        </div>
      )}
    </div>
  );
}
