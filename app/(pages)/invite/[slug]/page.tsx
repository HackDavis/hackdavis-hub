'use client';

import { processInvite } from '@actions/invite/processInvite';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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
    return <div>Bad Invite Link</div>;
  } else {
    return <div>Directing you to registration...</div>;
  }
}
