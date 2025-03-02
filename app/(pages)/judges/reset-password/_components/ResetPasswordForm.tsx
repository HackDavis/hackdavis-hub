'use client';

import { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import RegisterAction from '@actions/auth/register';
import styles from './ResetPasswordForm.module.scss';

export default function ResetPasswordForm({ data }: any) {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordDupe, setPasswordDupe] = useState('');
  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordDupeError, setPasswordDupeError] = useState(false);

  // TODO: implement password reset once invite tokens are finalized
  const handleReset = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    const response = await RegisterAction({});
    setLoading(false);

    if (response.ok) {
      router.push('/judges');
    } else if (response.error) {
      setError(response.error);
    } else {
      setError('Invalid email or password.');
    }
  };

  const validateForm = (
    email: string,
    password: string,
    passwordDupe: string
  ) => {
    const isEmailValid = /\S+@\S+\.\S+/.test(email) || email.length === 0;
    if (!isEmailValid) {
      setError('Email invalid format.');
    }
    setPasswordError(!isEmailValid);

    const isPasswordValid =
      password.length >= 6 || password.length <= 20 || password.length === 0;
    if (!isPasswordValid) {
      setError('Password is too short.');
    }
    setPasswordError(!isPasswordValid);

    const passwordMatch =
      password === passwordDupe || passwordDupe.length === 0;
    if (!passwordMatch) {
      setError("Passwords don't match.");
    }
    setPasswordDupeError(!passwordMatch);

    setValid(isEmailValid && isPasswordValid && passwordMatch);
    if (
      email.length === 0 ||
      password.length === 0 ||
      passwordDupe.length === 0
    ) {
      setValid(false);
    }
    if (isEmailValid && isPasswordValid && passwordMatch) {
      setError('');
    }
  };

  useEffect(() => {
    validateForm(email, password, passwordDupe);
  }, [email, password, passwordDupe]);

  return (
    <form onSubmit={handleReset} className={styles.container}>
      <p className={styles.error_msg}>{error}</p>
      <div className={styles.fields}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={data ? data.email : email}
          onInput={(e: ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
          readOnly={data ? true : false}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={password}
          onInput={(e: ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
          className={`${passwordError ? styles.error : null}`}
        />
        <input
          type="password"
          placeholder="Retype password"
          value={passwordDupe}
          onInput={(e: ChangeEvent<HTMLInputElement>) =>
            setPasswordDupe(e.target.value)
          }
          className={`${passwordDupeError ? styles.error : null}`}
        />
        <input
          name="name"
          type="hidden"
          defaultValue={data ? data.name : 'HackDavis Admin'}
        />
        <input
          name="specialty"
          type="hidden"
          defaultValue={data ? data.specialty : 'tech'}
        />
        <input
          name="role"
          type="hidden"
          defaultValue={data ? data.role : 'admin'}
        />
      </div>
      <button
        className={`${styles.login_button} ${valid ? styles.valid : null}`}
        type="submit"
        disabled={loading || !valid}
      >
        Reset password
      </button>
      <div className={styles.not_judge}>
        Not a judge? <Link href="/hackers">Click here</Link>
      </div>
    </form>
  );
}
