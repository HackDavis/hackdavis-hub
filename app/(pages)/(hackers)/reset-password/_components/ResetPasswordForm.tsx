'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import useAuthForm from '@hooks/useAuthForm';
import ResetPasswordAction from '@actions/auth/resetPassword';
import VocalAngelCow from 'public/hackers/mvp/vocal_angel_cow.svg';
import styles from './ResetPasswordForm.module.scss';

export default function ResetPasswordForm({ data }: any) {
  const router = useRouter();

  const handleFormSubmit = async (fields: any) => {
    return ResetPasswordAction({
      email: fields.email,
      password: fields.password,
    });
  };

  const {
    fields,
    errors,
    loading,
    valid,
    submitted,
    handleChange,
    handleSubmit,
  } = useAuthForm({
    initialValues: {
      email: data?.email,
      password: '',
      passwordDupe: '',
    },
    onSubmit: handleFormSubmit,
  });

  useEffect(() => {
    if (!loading && !errors.submit && submitted) {
      router.push('/login');
    }
  }, [loading, errors.submit, submitted, router]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Image src={VocalAngelCow} alt="Angel Cow" height={100} width={100} />
        <div className={styles.header_text}>
          <h1>Hi Hacker!</h1>
          <p>Please enter your new password below!</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <p className={styles.error_msg}>{errors.password}</p>
        <div className={styles.fields}>
          <div>
            <label htmlFor="email">NEW PASSWORD</label>
            <input
              name="password"
              type="password"
              value={fields.password}
              onInput={handleChange}
              className={`${errors.password ? styles.error : null}`}
            />
          </div>
          <div>
            <p className={styles.error_msg}>{errors.passwordDupe}</p>
            <label htmlFor="password">RETYPE NEW PASSWORD</label>
            <input
              name="passwordDupe"
              type="password"
              value={fields.passwordDupe}
              onInput={handleChange}
              className={`${errors.passwordDupe ? styles.error : null}`}
            />
          </div>
        </div>

        <div className={styles.bottom}>
          <div />
          <button
            type="submit"
            disabled={loading || !valid}
            className={`${styles.reset_button} ${valid ? styles.valid : null}`}
          >
            Reset Password →
          </button>
        </div>
      </form>
    </div>
  );
}
