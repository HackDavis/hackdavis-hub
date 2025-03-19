'use client';

import { useEffect, ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import useAuthForm from '@hooks/useAuthForm';
import VocalAngelCow from 'public/hackers/mvp/vocal_angel_cow.svg';
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
  title: string;
  subtitle: ReactNode;
  fields: FormField[];
  buttonText: string;
  linkText?: string;
  linkHref?: string;
  initialValues: Record<string, string>;
  onSubmit: (values: Record<string, string>) => Promise<any>;
  onSuccess: () => void;
}

export default function AuthForm({
  title,
  subtitle,
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
      <div className={styles.header}>
        <Image src={VocalAngelCow} alt="Angel Cow" height={100} width={100} />
        <div className={styles.header_text}>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </div>

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
    </div>
  );
}
