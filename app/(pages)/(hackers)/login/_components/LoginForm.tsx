'use client';

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import LoginAction from '@actions/auth/login';
import styles from './LoginForm.module.scss';

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [valid, setValid] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError('');
    const response = await LoginAction(email, password);
    setLoading(false);

    if (response.ok) {
      router.push('/');
    } else if (response.error) {
      setError(response.error);
    } else {
      setError('Invalid email or password.');
    }
  };

  const validateForm = (email: string, password: string) => {
    const isEmailValid = /\S+@\S+\.\S+/.test(email);
    const isPasswordValid = password.length >= 6 && password.length <= 20;
    setValid(isEmailValid && isPasswordValid);
  };

  useEffect(() => {
    validateForm(email, password);
  }, [email, password]);

  return (
    <div className={styles.container}>
      <form onSubmit={handleLogin}>
        <label htmlFor="email">Email</label>
        <input
          name="email"
          type="email"
          value={email}
          onInput={(e: ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
        />
        <label htmlFor="password">Password</label>
        <input
          name="password"
          type="password"
          value={password}
          onInput={(e: ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
        />
        <p className={styles.error_msg}>{error}</p>
        <button type="submit" disabled={loading || !valid}>
          Log in →
        </button>
        <Link href="/login/forgot-password">Forgot Password?</Link>
      </form>
    </div>
  );
}
