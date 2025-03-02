'use client';

import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

import ResetPasswordAction from '@actions/auth/resetPassword';
import styles from './ResetPasswordForm.module.scss';

export default function ResetPasswordForm({ data }: any) {
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [passwordDupe, setPasswordDupe] = useState('');
  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordDupeError, setPasswordDupeError] = useState(false);

  const handleReset = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    const response = await ResetPasswordAction({
      email: data.email,
      password,
    });

    if (response.ok) {
      router.push('/login');
    } else {
      setError(response.error ?? 'Invalid email or password.');
    }

    setLoading(false);
  };

  const validateForm = (password: string, passwordDupe: string) => {
    const isPasswordValid =
      (password.length >= 6 && password.length <= 20) || password.length === 0;
    if (!isPasswordValid) {
      setError('Password must be between 6 and 20 characters.');
    }
    setPasswordError(!isPasswordValid);

    const passwordMatch = password === passwordDupe;
    if (!passwordMatch) {
      setError("Passwords don't match.");
    }
    setPasswordDupeError(!passwordMatch);

    if (password.length === 0 || passwordDupe.length === 0) {
      setValid(false);
    }
    if (isPasswordValid && passwordMatch) {
      setError('');
      setValid(true);
    }
  };

  useEffect(() => {
    validateForm(password, passwordDupe);
  }, [password, passwordDupe]);

  return (
    <div>
      <form onSubmit={handleReset} className={styles.container}>
        <p className={styles.error_msg}>{error}</p>
        <div className={styles.fields}>
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
        </div>
        <button
          className={`${styles.login_button} ${valid ? styles.valid : null}`}
          type="submit"
          disabled={loading || !valid}
        >
          Reset Password
        </button>
      </form>
    </div>
  );
}
