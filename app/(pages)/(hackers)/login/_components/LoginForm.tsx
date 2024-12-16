'use client';

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';

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
    const formData = new FormData(e.currentTarget);
    const response = await LoginAction(
      formData.get('email'),
      formData.get('password')
    );
    setLoading(false);

    if (response.ok) {
      router.push('/');
    } else {
      setError('Invalid email or password.');
    }
  };

  const validateForm = (email: string, password: string) => {
    const isEmailValid = /\S+@\S+\.\S+/.test(email);
    const isPasswordValid = password.length >= 6;
    setValid(isEmailValid && isPasswordValid);
  };

  useEffect(() => {
    validateForm(email, password);
  }, [email, password]);

  return (
    <form onSubmit={handleLogin} className={styles.container}>
      <label htmlFor="email">Email</label>
      <input
        name="email"
        type="email"
        value={email}
        onInput={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
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
    </form>
  );
}
