'use client';

import { useState, FormEvent } from 'react';

import LoginAction from '@actions/auth/login';
import styles from './LoginForm.module.scss';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
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

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <label htmlFor="email">Email</label>
      <input name="email" type="email" />
      <label htmlFor="password">Password</label>
      <input name="password" type="password" />
      <p className={styles.error_msg}>{error}</p>
      <button type="submit" disabled={loading}>
        Log in →
      </button>
    </form>
  );
}
