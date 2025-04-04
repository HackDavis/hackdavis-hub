'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { getUser } from '@actions/users/getUser';
import LogoutAction from '@actions/auth/logout';
import User from '@typeDefs/user';

export default function useActiveUser(failRedirectRoute: string) {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();

  useEffect(() => {
    const getActiveUser = async (id: string) => {
      const userRes = await getUser(id);
      if (!userRes.ok || !userRes.body) {
        await LogoutAction();
        router.push('/error');
        return;
      }

      setUser(userRes.body);
      setLoading(false);
    };

    if (status === 'loading') {
      return;
    } else if (status === 'unauthenticated') {
      router.push(failRedirectRoute);
      return;
    } else if (session) {
      getActiveUser(session.user.id);
    }
  }, [session, status, router, failRedirectRoute]);

  return { user, loading };
}
