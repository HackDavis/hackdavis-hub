'use client';

import { useEffect, useState, FormEvent, ChangeEvent } from 'react';

import styles from './ForgotPasswordForm.module.scss';
import { sendEmail } from '@actions/invite/sendEmail';

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
    <div>
      <form onSubmit={handleForgotPassword}>
        <p className={styles.error_msg}>{error}</p>
        <p>{sentMessage}</p>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={email}
          onInput={(e: ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
        />
        <button type="submit" disabled={loading || !valid}>
          Reset Password
        </button>
      </form>
    </div>
  );
}
