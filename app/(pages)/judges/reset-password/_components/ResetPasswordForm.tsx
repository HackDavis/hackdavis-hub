import { useEffect, useState, ChangeEvent } from 'react';
import { useFormState } from 'react-dom';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { useInvite } from '@hooks/useInvite';
import ResetPassword from '@actions/auth/resetPassword';
import styles from './ResetPasswordForm.module.scss';

export default function ResetPasswordForm() {
  const router = useRouter();
  const { data } = useInvite('reset');
  const [password, setPassword] = useState('');
  const [passwordDupe, setPasswordDupe] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordDupeError, setPasswordDupeError] = useState(false);

  const [resetState, ResetPasswordAction] = useFormState(ResetPassword, {
    ok: false,
    body: null,
    error: null,
  });

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handlePasswordDupeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPasswordDupe(event.target.value);
  };

  const validateForm = (password: string, passwordDupe: string) => {
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
    setIsValid(isPasswordValid && passwordMatch);
    if (isPasswordValid && passwordMatch) {
      setError('');
    }
  };

  useEffect(() => {
    if (resetState.ok === true) {
      setError('');
      router.push('/judges');
    } else {
      const err = resetState.error as string;
      setError(err);
    }
  }, [resetState, router]);

  useEffect(() => {
    validateForm(password, passwordDupe);
  }, [password, passwordDupe]);

  return (
    <form action={ResetPasswordAction} className={styles.container}>
      <p className={styles.error_msg}>{error}</p>
      <div className={styles.fields}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          defaultValue={data ? data.email : ''}
          readOnly
        />
        <input
          name="password"
          type="password"
          placeholder="New password"
          value={password}
          onChange={handlePasswordChange}
          className={`${passwordError ? styles.error : null}`}
        />
        <input
          type="password"
          placeholder="Retype new password"
          value={passwordDupe}
          onChange={handlePasswordDupeChange}
          className={`${passwordDupeError ? styles.error : null}`}
        />
      </div>
      <button
        className={`${styles.login_button} ${isValid ? styles.valid : null}`}
        type="submit"
        disabled={!isValid}
      >
        Reset password
      </button>
      <div className={styles.not_judge}>
        Not a judge? <Link href="/hackers">Click here</Link>
      </div>
    </form>
  );
}
