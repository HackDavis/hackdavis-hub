'use client';

import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import ResetPasswordAction from '@actions/auth/resetPassword';
import VocalAngelCow from 'public/hackers/mvp/vocal_angel_cow.svg';
import styles from './ResetPasswordForm.module.scss';

export default function ResetPasswordForm({ data }: any) {
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [passwordDupe, setPasswordDupe] = useState('');
  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordDupeError, setPasswordDupeError] = useState('');

  const handleReset = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setPasswordError('');
    setPasswordDupeError('');

    const response = await ResetPasswordAction({
      email: data.email,
      password,
    });

    if (response.ok) {
      router.push('/login');
    } else {
      setPasswordError(response.error ?? 'Failed to reset password');
    }

    setLoading(false);
  };

  const validateForm = (password: string, passwordDupe: string) => {
    const isPasswordValid = password.length >= 6 && password.length <= 20;
    if (!isPasswordValid) {
      setPasswordError(
        password.length === 0
          ? ''
          : 'Password must be between 6 and 20 characters.'
      );
    } else {
      setPasswordError('');
    }

    const passwordMatch = password === passwordDupe;
    if (!passwordMatch) {
      setPasswordDupeError(
        passwordDupe.length === 0 ? '' : "Passwords don't match."
      );
    } else {
      setPasswordDupeError('');
    }

    setValid(isPasswordValid && passwordMatch);
  };

  useEffect(() => {
    validateForm(password, passwordDupe);
  }, [password, passwordDupe]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Image src={VocalAngelCow} alt="Angel Cow" height={100} width={100} />
        <div className={styles.header_text}>
          <h1>Hi Hacker!</h1>
          <p>Please enter your new password below!</p>
        </div>
      </div>
      <form onSubmit={handleReset} className={styles.form}>
        <p className={styles.error_msg}>{passwordError}</p>
        <div className={styles.fields}>
          <div>
            <label htmlFor="email">NEW PASSWORD</label>
            <input
              name="password"
              type="password"
              // placeholder="Password"
              value={password}
              onInput={(e: ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              className={`${passwordError ? styles.error : null}`}
            />
          </div>
          <div>
            <p className={styles.error_msg}>{passwordDupeError}</p>
            <label htmlFor="password">RETYPE NEW PASSWORD</label>
            <input
              type="password"
              // placeholder="Retype password"
              value={passwordDupe}
              onInput={(e: ChangeEvent<HTMLInputElement>) =>
                setPasswordDupe(e.target.value)
              }
              className={`${passwordDupeError ? styles.error : null}`}
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
