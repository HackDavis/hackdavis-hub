import { useEffect, useState, ChangeEvent } from 'react';
import { useFormState } from 'react-dom';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
// import Link from 'next/link';

import LoginAction from '@actions/auth/login';
import styles from './LoginForm.module.scss';

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState('');

  const [loginState, Login] = useFormState(LoginAction, {
    ok: false,
    body: null,
    error: null,
  });

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const validateForm = (email: string, password: string) => {
    // Simple email validation
    const isEmailValid = /\S+@\S+\.\S+/.test(email);
    // Password validation (example: minimum length of 6 characters)
    const isPasswordValid = password.length >= 6;

    // Set isValid state based on email and password validity
    setIsValid(isEmailValid && isPasswordValid);
  };

  useEffect(() => {
    if (loginState.ok === true) {
      setError('');
      router.push('/');
    } else {
      const err = loginState.error as string;
      setError(err);
    }
  }, [loginState, router]);

  useEffect(() => {
    validateForm(email, password);
  }, [email, password]);

  return (
    <form action={Login} className={styles.container}>
      <div className={styles.fields}>
        <div className={styles.input_container}>
          <label htmlFor="email">Username</label>
          <input
            name="email"
            type="email"
            // placeholder="Username"
            value={email}
            onChange={handleEmailChange}
            className={`${error ? styles.error : null}`}
          />
        </div>
        <div className={styles.input_container}>
          <label htmlFor="password">Password</label>
          <input
            name="password"
            type="password"
            // placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            className={`${error ? styles.error : null}`}
          />
        </div>
        <p className={styles.error_msg}>{error}</p>
      </div>
      <div className={styles.login_button_container}>
        <div className={styles.froggie_container}>
          <Image
            src="/login/LogIn_DrumStick.svg"
            alt="froggie_drumstick"
            width={10}
            height={10}
            className={styles.drumstick}
          />
          <Image
            src="/login/LogIn_Froggy.svg"
            alt="froggie"
            width={50}
            height={50}
            className={styles.froggie}
          />
        </div>
        <button
          className={`${styles.login_button} ${isValid ? styles.valid : null}`}
          type="submit"
          disabled={!isValid}
        >
          Log in →
        </button>
      </div>
      {/* <div className={styles.not_judge}>
        Not a judge? <Link href="/hackers">Click here</Link>
      </div> */}
    </form>
  );
}
