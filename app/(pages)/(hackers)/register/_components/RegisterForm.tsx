'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import useAuthForm from '@hooks/useAuthForm';
import RegisterAction from '@actions/auth/register';
import VocalAngelCow from 'public/hackers/mvp/vocal_angel_cow.svg';
import styles from './RegisterForm.module.scss';

export default function RegisterForm({ data }: any) {
  const router = useRouter();

  const name = data?.name ? data.name : 'HackDavis Admin';
  const role = data?.role ? data.role : 'admin';

  const handleFormSubmit = async (fields: any) => {
    return RegisterAction({
      name,
      email: fields.email,
      password: fields.password,
      role,
      has_checked_in: true,
    });
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
      email: data?.email || '',
      password: '',
      passwordDupe: '',
    },
    onSubmit: handleFormSubmit,
  });

  useEffect(() => {
    if (!loading && !errors.submit && submitted) {
      if (role === 'admin') {
        router.push('/');
      } else {
        router.push('/register/details');
      }
    }
  }, [loading, errors.submit, submitted, role, router]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Image src={VocalAngelCow} alt="Angel Cow" height={100} width={100} />
        <div className={styles.header_text}>
          <h1>Hi {name}!</h1>
          <p>
            Welcome to the HackerHub! The HackDavis team made this for all your
            hacking needs &lt;3
            <br />
            Let&#39;s get you started by making a password with us.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <p className={styles.error_msg}>{errors.submit}</p>
        <div className={styles.fields}>
          <div>
            <label htmlFor="email">EMAIL</label>
            <input
              name="email"
              type="email"
              value={data ? data.email : fields.email}
              onInput={handleChange}
              readOnly={data ? true : false}
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

          <div>
            <p className={styles.error_msg}>{errors.passwordDupe}</p>
            <label htmlFor="passwordDupe">RETYPE PASSWORD</label>
            <input
              name="passwordDupe"
              type="password"
              value={fields.passwordDupe}
              onInput={handleChange}
              className={`${errors.passwordDupe ? styles.error : null}`}
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
