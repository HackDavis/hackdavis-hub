'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { getUser } from '@actions/users/getUser';
import LogoutAction from '@actions/auth/logout';

export default function useActiveUser() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();

  useEffect(() => {
    const getActiveUser = async (id: string) => {
      const userRes = await getUser(id);
      if (!userRes.ok) {
        await LogoutAction();
        router.push('/');
        return;
      }

      setUser(userRes.body);
      setLoading(false);
    };

    if (status === 'loading') {
      return;
    } else if (status === 'unauthenticated') {
      router.push('/login');
      return;
    } else if (session) {
      const id = session.user.id;
      getActiveUser(id);
    }
  }, [session, status, router]);

  return { user, loading };
}
