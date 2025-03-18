'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

import useAuthForm from '@hooks/useAuthForm';
import LoginAction from '@actions/auth/login';
import VocalAngelCow from 'public/hackers/mvp/vocal_angel_cow.svg';
import styles from './LoginForm.module.scss';

export default function LoginForm() {
  const router = useRouter();

  const handleFormSubmit = async (fields: any) => {
    return LoginAction(fields.email, fields.password);
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
      password: '',
    },
    onSubmit: handleFormSubmit,
  });

  useEffect(() => {
    if (!loading && !errors.submit && submitted) {
      router.push('/');
    }
  }, [loading, errors.submit, submitted, router]);

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

      <form onSubmit={handleSubmit} className={styles.form}>
        <p className={styles.error_msg}>{errors.submit}</p>
        <div className={styles.fields}>
          <div>
            <p className={styles.error_msg}>{errors.email}</p>
            <label htmlFor="email">EMAIL</label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email here"
              value={fields.email}
              onInput={handleChange}
            />
          </div>
          <div>
            <p className={styles.error_msg}>{errors.password}</p>
            <label htmlFor="password">PASSWORD</label>
            <input
              name="password"
              type="password"
              value={fields.password}
              onInput={handleChange}
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
