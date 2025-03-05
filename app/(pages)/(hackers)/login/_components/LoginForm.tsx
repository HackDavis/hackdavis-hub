'use client';

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

import LoginAction from '@actions/auth/login';
import VocalAngelCow from 'public/hackers/mvp/vocal_angel_cow.svg';
import styles from './LoginForm.module.scss';

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [valid, setValid] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setEmailError('');
    setPasswordError('');
    const response = await LoginAction(email, password);
    setLoading(false);

    if (response.ok) {
      router.push('/');
    } else if (response.error) {
      setEmailError(response.error);
    } else {
      setEmailError('Invalid email or password.');
    }
  };

  const validateForm = (email: string, password: string) => {
    const isEmailValid = /\S+@\S+\.\S+/.test(email);
    if (!isEmailValid) {
      setEmailError(email.length === 0 ? '' : 'Invalid email format');
    } else {
      setEmailError('');
    }

    const isPasswordValid = password.length >= 6 && password.length <= 20;
    if (!isPasswordValid) {
      setPasswordError(
        password.length === 0 ? '' : 'Password is between 6 and 20 characters.'
      );
    } else {
      setPasswordError('');
    }

    setValid(isEmailValid && isPasswordValid);
  };

  useEffect(() => {
    validateForm(email, password);
  }, [email, password]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Image src={VocalAngelCow} alt="Angel Cow" height={100} width={100} />
        <div className={styles.header_text}>
          <h1>Hi Hacker!</h1>
          <p>
            Welcome to the HackerHub! The HackDavis team made this all for your
            hacking needs &lt;3
          </p>
        </div>
      </div>
      <form onSubmit={handleLogin} className={styles.form}>
        <p className={styles.error_msg}>{emailError}</p>
        <div className={styles.fields}>
          <div>
            <label htmlFor="email">EMAIL</label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email here"
              value={email}
              onInput={(e: ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
            />
          </div>
          <div>
            <p className={styles.error_msg}>{passwordError}</p>
            <label htmlFor="password">PASSWORD</label>
            <input
              name="password"
              type="password"
              // placeholder="Enter password here"
              value={password}
              onInput={(e: ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
            />
          </div>
        </div>

        <div className={styles.bottom}>
          <Link href="/login/forgot-password" className={styles.forgot}>
            Forgot Password?
          </Link>
          <button
            type="submit"
            disabled={loading || !valid}
            className={`${styles.login_button} ${valid ? styles.valid : null}`}
          >
            Log in →
          </button>
        </div>
      </form>
    </div>
  );
}
