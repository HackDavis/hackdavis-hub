import { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { hash } from 'bcryptjs';

import LoginAction from '@actions/auth/login';
import { useInvite } from '@hooks/useInvite';
import styles from './RegisterForm.module.scss';
import { createUser } from '@actions/users/createUser';

export default function RegisterForm() {
  const router = useRouter();

  const { data } = useInvite('register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordDupe, setPasswordDupe] = useState('');
  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordDupeError, setPasswordDupeError] = useState(false);

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError('');
    const formData = new FormData(e.currentTarget);
    const emailString = formData.get('email') as string;
    const passwordString = formData.get('password') as string;
    const hashedPassword = await hash(passwordString, 10);

    const userRes = await createUser(
      data?.name ? data.name : 'HackDavis Admin',
      emailString,
      hashedPassword,
      // data?.specialties ? data.specialties : ['tech'],
      ['tech'],
      data?.role ? data.role : 'admin'
    );

    if (!userRes.ok) {
      setError(userRes.error ? userRes.error : 'Error creating account.');
      setLoading(false);
      return;
    }

    const response = await LoginAction(
      formData.get('email'),
      formData.get('password')
    );
    setLoading(false);

    if (response.ok) {
      router.push('/');
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
    <form onSubmit={handleRegister} className={styles.container}>
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
        Create account
      </button>
      <div className={styles.not_judge}>
        Not a judge? <Link href="/hackers">Click here</Link>
      </div>
    </form>
  );
}
