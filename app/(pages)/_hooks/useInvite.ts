'use client';

import { useSearchParams } from 'next/navigation';

import verifyInvite from '@actions/invite/verifyInvite';
import { useState, useEffect } from 'react';

interface InviteData {
  email: string;
  exp: number;
}

export function useInvite(type: string = 'register') {
  const searchParams = useSearchParams();

  const [pending, setPending] = useState(true);
  const [data, setData] = useState<InviteData | null>(null);

  useEffect(() => {
    const data = searchParams.get('data');
    const sig = searchParams.get('sig');

    const verifyInviteWrapper = async () => {
      const verified = await verifyInvite(data as string, sig as string);
      if (verified) {
        const dje = atob(data as string);
        const dj = JSON.parse(dje) as InviteData;
        setData(dj);
      }
      setPending(false);
    };

    verifyInviteWrapper();
  }, [searchParams, type]);
  return { pending, data };
}
