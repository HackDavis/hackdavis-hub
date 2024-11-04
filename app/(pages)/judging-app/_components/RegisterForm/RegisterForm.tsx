import { useEffect, useState, ChangeEvent } from 'react';
import { useFormState } from 'react-dom';
import { useAuth } from '@hooks/useAuth';
import Register from '@actions/auth/register';

import styles from './RegisterForm.module.scss';
import Link from 'next/link';
import AuthTokenInt from '@typeDefs/authToken';
import { useInvite } from '@hooks/useInvite';
import { useRouter } from 'next/navigation';

export default function RegisterForm() {
  const router = useRouter();

  const { data } = useInvite('register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordDupe, setPasswordDupe] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordDupeError, setPasswordDupeError] = useState(false);

  const [registerState, RegisterAction] = useFormState(Register, {
    ok: false,
    body: null,
    error: null,
  });
  const { login } = useAuth();

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handlePasswordDupeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPasswordDupe(event.target.value);
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

    // Password validation (example: minimum length of 6 characters)
    const isPasswordValid = password.length >= 6 || password.length === 0;
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

    // Set isValid state based on email and password validity
    setIsValid(isEmailValid && isPasswordValid && passwordMatch);
    if (isEmailValid && isPasswordValid && passwordMatch) {
      setError('');
    }
  };

  useEffect(() => {
    if (registerState.ok === true) {
      const user = registerState.body as AuthTokenInt;
      setError('');
      login(user);
      router.push('/');
    } else {
      const err = registerState.error as string;
      setError(err);
    }
  }, [registerState, login, router]);

  useEffect(() => {
    validateForm(email, password, passwordDupe);
  }, [email, password, passwordDupe]);

  return (
    <form action={RegisterAction} className={styles.container}>
      <p className={styles.error_msg}>{error}</p>
      <div className={styles.fields}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={data ? data.email : email}
          onChange={handleEmailChange}
          readOnly={data ? true : false}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
          className={`${passwordError ? styles.error : null}`}
        />
        <input
          type="password"
          placeholder="Retype password"
          value={passwordDupe}
          onChange={handlePasswordDupeChange}
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
        className={`${styles.login_button} ${isValid ? styles.valid : null}`}
        type="submit"
        disabled={!isValid}
      >
        Create account
      </button>
      <div className={styles.not_judge}>
        Not a judge? <Link href="/hackers">Click here</Link>
      </div>
    </form>
  );
}
