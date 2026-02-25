'use client';

import Link from 'next/link';
import Image from 'next/image';

import useAuthForm from '@hooks/useAuthForm';
import Loader from '@components/Loader/Loader';
import Froggy from 'public/login/LogIn_Froggy.svg';
import Drumstick from 'public/login/LogIn_DrumStick.svg';
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

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.top_container}>
          <p className={styles.error_msg}>{errors.submit}</p>
          <div className={styles.fields}>
            {fields.map((field) => (
              <div key={field.name}>
                <p className={styles.error_msg}>{errors[field.name]}</p>
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
          {role === 'judge' && (
            <div className={styles.froggy_container}>
              <Image
                src={Drumstick}
                alt="froggy_drumstick"
                width={10}
                height={10}
                className={styles.drumstick}
              />
              <Image
                src={Froggy}
                alt="froggy"
                width={50}
                height={50}
                className={styles.froggy}
              />
            </div>
          )}

          <div className={styles.bottom}>
            <div />
            <button
              type="submit"
              disabled={loading || !valid}
              className={`${styles.submit_button} ${
                valid ? styles.valid : null
              }`}
            >
              {buttonText}
            </button>
          </div>
        </div>
      </form>

      {loading && <Loader />}
    </div>
  );
}
