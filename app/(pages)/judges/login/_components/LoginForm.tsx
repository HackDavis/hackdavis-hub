import { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
// import Link from 'next/link';

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
      router.push('/judges');
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
      <div className={styles.fields}>
        <div className={styles.input_container}>
          <label htmlFor="email">Username</label>
          <input
            name="email"
            type="email"
            value={email}
            onInput={(e: ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            className={`${error ? styles.error : null}`}
          />
        </div>
        <div className={styles.input_container}>
          <label htmlFor="password">Password</label>
          <input
            name="password"
            type="password"
            value={password}
            onInput={(e: ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
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
          className={`${styles.login_button} ${
            valid ? null : styles.not_valid
          }`}
          type="submit"
          disabled={loading || !valid}
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
