'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { processInvite } from '@actions/invite/processInvite';
import styles from './page.module.scss';

export default function Page({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [valid, setValid] = useState(true);

  useEffect(() => {
    const handleInvite = async () => {
      if (await processInvite(params.slug)) {
        setValid(true);
        router.push('/register');
      } else {
        setValid(false);
      }
    };

    handleInvite();
  });

  if (!valid) {
    return <div>Your invite link is invalid or may have expired.</div>;
  } else {
    return (
      <div className={styles.loading_container}>
        <div className={styles.loader}></div>
      </div>
    );
  }
}
