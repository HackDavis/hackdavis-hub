'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { processInvite } from '@actions/invite/processInvite';
import Loader from '@pages/_components/Loader/Loader';

export default function Page({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [valid, setValid] = useState(true);

  useEffect(() => {
    const handleReset = async () => {
      if (await processInvite(params.slug)) {
        setValid(true);
        router.push('/reset-password');
      } else {
        setValid(false);
      }
    };

    handleReset();
  });

  if (!valid) {
    return <div>Your invite link is invalid or may have expired.</div>;
  } else {
    return <Loader />;
  }
}
