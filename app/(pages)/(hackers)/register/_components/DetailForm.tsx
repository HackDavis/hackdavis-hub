'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { updateUser } from '@actions/users/updateUser';
import VocalAngelCow from 'public/hackers/mvp/vocal_angel_cow.svg';
import DeveloperCow from 'public/hackers/mvp/developer_cow.svg';
import DesignerBunny from 'public/hackers/mvp/designer_bunny.svg';
import PmFroggy from 'public/hackers/mvp/pm_froggy.svg';
import OtherDucky from 'public/hackers/mvp/other_ducky.svg';
import styles from './DetailForm.module.scss';

const characters = [
  {
    label: 'DEVELOPER',
    role: 'developer',
    image: DeveloperCow,
    alt: 'Developer Cow',
  },
  {
    label: 'DESIGNER',
    role: 'designer',
    image: DesignerBunny,
    alt: 'Designer Bunny',
  },
  {
    label: 'PROJECT MANAGER',
    role: 'pm',
    image: PmFroggy,
    alt: 'PM Froggy',
  },
  {
    label: 'OTHER',
    role: 'other',
    image: OtherDucky,
    alt: 'Other Ducky',
  },
];

export default function DetailForm({ data, id }: any) {
  const router = useRouter();

  const name = data?.name ? data.name : 'HackDavis Admin';

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [valid, setValid] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState('');

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);

    const position = formData.get('position') as string;
    const is_beginner = formData.get('beginner') !== null;

    const userRes = await updateUser(id, {
      $set: {
        position,
        is_beginner,
      },
    });

    if (userRes.ok) {
      router.push('/');
    } else {
      setError(userRes.error ?? 'Error updating details');
    }

    setLoading(false);
  };

  useEffect(() => {
    setValid(selectedPosition !== '');
  }, [selectedPosition]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Image src={VocalAngelCow} alt="Angel Cow" height={100} width={100} />
        <div className={styles.header_text}>
          <h1>Hi {name}!</h1>
          <p>
            One more thing before you enter the hub.
            <br />
            Choose what suits you the most:
          </p>
        </div>
      </div>

      <form onSubmit={handleRegister} className={styles.form}>
        {error && <p className={styles.error_msg}>{error}</p>}

        <div className={styles.characterGrid}>
          {characters.map(({ label, role, image, alt }) => (
            <div
              key={role}
              className={`${styles.characterOption} ${
                selectedPosition === role ? styles.selected : ''
              }`}
            >
              <input
                id={role}
                name="position"
                type="radio"
                value={role}
                checked={selectedPosition === role}
                onChange={() => setSelectedPosition(role)}
                className={styles.radioInput}
              />
              <label htmlFor={role} className={styles.character}>
                <Image
                  src={image}
                  alt={alt}
                  objectFit="fit"
                  className={styles.characterImage}
                />
                <span className={styles.characterLabel}>{label}</span>
              </label>
            </div>
          ))}
        </div>

        <div className={styles.bottom}>
          <div className={styles.beginnerOption}>
            <input
              id="beginner"
              name="beginner"
              type="checkbox"
              className={styles.checkboxInput}
            />
            <label htmlFor="beginner" className={styles.beginnerLabel}>
              I am a beginner
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || !valid}
            className={`${styles.submit_button} ${valid ? styles.valid : null}`}
          >
            Take me to the hub! →
          </button>
        </div>
      </form>
    </div>
  );
}
