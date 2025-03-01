'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

import { updateUser } from '@actions/users/updateUser';
import styles from './DetailForm.module.scss';

export default function DetailForm({ data, id }: any) {
  const router = useRouter();

  const name = data?.name ? data.name : 'HackDavis Admin';

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);

    const position = formData.get('position') as string;
    const is_beginner = formData.get('beginner') !== null;

    const userRes = await updateUser(id, {
      position,
      is_beginner,
    });

    if (userRes.ok) {
      router.push('/');
    } else {
      setError(userRes.error ?? 'Error updating details');
    }

    setLoading(false);
  };

  return (
    <div>
      <h1>Hi {name}!</h1>
      <form onSubmit={handleRegister}>
        <p className={styles.error_msg}>{error}</p>
        <div className={styles.fields}>
          <div>
            <input name="position" type="radio" value="developer" />
            <label htmlFor="developer">Developer</label>
            <input name="position" type="radio" value="designer" />
            <label htmlFor="designer">Designer</label>
            <input name="position" type="radio" value="pm" />
            <label htmlFor="pm">Project Manager</label>
            <input name="position" type="radio" value="other" />
            <label htmlFor="other">Other</label>
          </div>
          <input name="beginner" type="checkbox" />
          <label htmlFor="beginner">I am a beginner</label>
        </div>
        <button type="submit" disabled={loading}>
          Take me to the hub!
        </button>
      </form>
    </div>
  );
}
