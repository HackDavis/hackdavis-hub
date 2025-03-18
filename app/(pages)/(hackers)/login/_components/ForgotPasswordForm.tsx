'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

import useAuthForm from '@hooks/useAuthForm';
import sendEmail from '@actions/invite/sendEmail';
import VocalAngelCow from 'public/hackers/mvp/vocal_angel_cow.svg';
import styles from './ForgotPasswordForm.module.scss';

export default function ForgotPasswordForm() {
  const handleFormSubmit = async (fields: any) => {
    return sendEmail({
      email: fields.email,
      role: 'hacker',
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
      email: '',
    },
    onSubmit: handleFormSubmit,
  });
  const [sentMessage, setSentMessage] = useState('');

  useEffect(() => {
    if (!loading && !errors.submit && submitted) {
      setSentMessage('Password reset email sent!');
    }
  }, [loading, errors.submit, submitted]);

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
        <div className={styles.fields}>
          <div>
            <p className={styles.error_msg}>{errors.email}</p>
            <p>{sentMessage}</p>
            <label htmlFor="email">EMAIL</label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email here"
              value={fields.email}
              onInput={handleChange}
            />
          </div>
        </div>

        <div className={styles.bottom}>
          <button
            type="submit"
            disabled={loading || !valid}
            className={`${styles.forgot_button} ${valid ? styles.valid : null}`}
          >
            Send Email →
          </button>
        </div>
      </form>
    </div>
  );
}
