'use client';

import { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import Image from 'next/image';

import sendEmail from '@actions/invite/sendEmail';
import VocalAngelCow from 'public/hackers/mvp/vocal_angel_cow.svg';
import styles from './ForgotPasswordForm.module.scss';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sentMessage, setSentMessage] = useState('');

  const handleForgotPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    const response = await sendEmail({
      email,
      role: 'hacker',
    });

    if (response.ok) {
      setSentMessage('Password reset email sent!');
    } else {
      setError(response.error ?? 'Error sending password reset email');
    }

    setLoading(false);
  };

  const validateForm = (email: string) => {
    const isEmailValid = /\S+@\S+\.\S+/.test(email);
    if (!isEmailValid) {
      setValid(false);
      setError(email.length === 0 ? '' : 'Invalid email format.');
    } else {
      setValid(true);
      setError('');
    }
  };

  useEffect(() => {
    validateForm(email);
  }, [email]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Image src={VocalAngelCow} alt="Angel Cow" height={100} width={100} />
        <div className={styles.header_text}>
          <h1>Hi Hacker!</h1>
          <p>Please enter your new password below!</p>
        </div>
      </div>
      <form onSubmit={handleForgotPassword} className={styles.form}>
        <p className={styles.error_msg}>{error}</p>
        <p>{sentMessage}</p>
        <div className={styles.fields}>
          <div>
            <label htmlFor="email">EMAIL</label>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={email}
              onInput={(e: ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
            />
          </div>
        </div>

        <div className={styles.bottom}>
          <div />
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
