'use client';

import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import RegisterAction from '@actions/auth/register';
import VocalAngelCow from 'public/hackers/mvp/vocal_angel_cow.svg';
import styles from './RegisterForm.module.scss';

export default function RegisterForm({ data }: any) {
  const router = useRouter();

  const name = data?.name ? data.name : 'HackDavis Admin';
  const role = data?.role ? data.role : 'admin';

  const [email, setEmail] = useState(data?.email ? data.email : '');
  const [password, setPassword] = useState('');
  const [passwordDupe, setPasswordDupe] = useState('');
  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordDupeError, setPasswordDupeError] = useState('');

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setPasswordError('');
    setPasswordDupeError('');

    const response = await RegisterAction({
      name,
      email,
      password,
      role,
      has_checked_in: true,
    });

    if (response.ok) {
      if (role === 'admin') {
        router.push('/');
      } else {
        router.push('/register/details');
      }
    } else {
      setPasswordError(response.error ?? 'Error registering user.');
    }

    setLoading(false);
  };

  const validateForm = (
    email: string,
    password: string,
    passwordDupe: string
  ) => {
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
    validateForm(email, password, passwordDupe);
  }, [email, password, passwordDupe]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Image src={VocalAngelCow} alt="Angel Cow" height={100} width={100} />
        <div className={styles.header_text}>
          <h1>Hi {name}!</h1>
          <p>
            Welcome to the HackerHub! The HackDavis team made this all for your
            hacking needs &lt;3
            <br />
            Let’s get you started by making a password with us.
          </p>
        </div>
      </div>
      <form onSubmit={handleRegister} className={styles.form}>
        <div className={styles.fields}>
          <div>
            <label htmlFor="email">EMAIL</label>
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
          </div>

          <div>
            <p className={styles.error_msg}>{passwordError}</p>
            <label htmlFor="password">PASSWORD</label>
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={password}
              onInput={(e: ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
            />
          </div>

          <div>
            <p className={styles.error_msg}>{passwordDupeError}</p>
            <label htmlFor="passwordDupe">RETYPE PASSWORD</label>
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
        </div>

        <div className={styles.bottom}>
          <div />
          <button
            type="submit"
            disabled={loading || !valid}
            className={`${styles.login_button} ${valid ? styles.valid : null}`}
          >
            Next →
          </button>
        </div>
      </form>
    </div>
  );
}
