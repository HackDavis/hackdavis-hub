'use client';

import { useEffect, useState, useRef, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { updateUser } from '@actions/users/updateUser';
import styles from './DetailForm.module.scss';
import Loader from '@pages/_components/Loader/Loader';
import tracks from '@apidata/tracks.json';

interface OptionItem {
  id: number;
  text: string;
  rank: number;
}

const initialOptions = [...new Set(tracks.map((track) => track.type))];

export default function DetailForm({ id }: any) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [options, setOptions] = useState<OptionItem[]>(
    initialOptions.map((option, index) => ({
      id: index + 1,
      text: option,
      rank: index + 1,
    }))
  );
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [animatingIndices, setAnimatingIndices] = useState<number[]>([]);

  const moveOption = (index: number, direction: 'up' | 'down'): void => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === options.length - 1) ||
      animatingIndices.length > 0
    ) {
      return;
    }

    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    setAnimatingIndices([index, targetIndex]);

    const currentRect = itemRefs.current[index]?.getBoundingClientRect();
    const targetRect = itemRefs.current[targetIndex]?.getBoundingClientRect();

    if (currentRect && targetRect) {
      const currentElem = itemRefs.current[index];
      const targetElem = itemRefs.current[targetIndex];

      if (currentElem && targetElem) {
        const yDistance = targetRect.top - currentRect.top;

        currentElem.style.transform = `translateY(0)`;
        targetElem.style.transform = `translateY(0)`;

        void currentElem.offsetHeight;

        currentElem.style.transition = 'transform 0.3s ease-in-out';
        targetElem.style.transition = 'transform 0.3s ease-in-out';

        currentElem.style.transform = `translateY(${yDistance}px)`;
        targetElem.style.transform = `translateY(${-yDistance}px)`;

        setTimeout(() => {
          const newOptions = [...options];
          [newOptions[index], newOptions[targetIndex]] = [
            newOptions[targetIndex],
            newOptions[index],
          ];

          newOptions.forEach((option, idx) => {
            option.rank = idx + 1;
          });

          setOptions(newOptions);
          setAnimatingIndices([]);

          currentElem.style.transition = '';
          targetElem.style.transition = '';
          currentElem.style.transform = '';
          targetElem.style.transform = '';
        }, 300);
      }
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    const specialties: string[] = options.map((option) => option.text);

    const userRes = await updateUser(id, {
      $set: {
        specialties,
      },
    });

    if (userRes.ok) {
      router.push('/judges');
    } else {
      setError(userRes.error ?? 'Error updating details');
    }

    setLoading(false);
  };

  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, options.length);
  }, [options.length]);

  return (
    <div>
      <form onSubmit={handleSubmit} className={styles.container}>
        <p className={styles.error_msg}>{error}</p>
        <ul>
          {options.map((option, index) => (
            <li
              key={option.id}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
            >
              <span>{option.text}</span>
              <div className={styles.swap_buttons}>
                <button
                  type="button"
                  onClick={() => moveOption(index, 'up')}
                  disabled={index === 0 || animatingIndices.length > 0}
                  className={
                    index === 0 || animatingIndices.length > 0
                      ? styles.arrow_invalid
                      : styles.arrow
                  }
                  aria-label="Swap up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveOption(index, 'down')}
                  disabled={
                    index === options.length - 1 || animatingIndices.length > 0
                  }
                  className={
                    index === options.length - 1 || animatingIndices.length > 0
                      ? styles.arrow_invalid
                      : styles.arrow
                  }
                  aria-label="Swap down"
                >
                  ↓
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className={styles.submit_button_container}>
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
            type="submit"
            disabled={loading}
            className={styles.submit_button}
          >
            Register →
          </button>
        </div>
      </form>

      {loading && <Loader />}
    </div>
  );
}
