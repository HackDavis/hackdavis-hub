'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { getUser } from '@actions/users/getUser';
import LogoutAction from '@actions/auth/logout';

export default function useActiveUser(failRedirectRoute: string) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { data: session, status } = useSession();

  useEffect(() => {
    let cancelled = false;

    const getActiveUser = async (id: string) => {
      const userRes = await getUser(id);
      if (!userRes.ok || !userRes.body) {
        await LogoutAction();
        router.push('/error');
        return;
      }

      if (!cancelled) {
        setUser(userRes.body);
        setLoading(false);
      }
    };

    if (status === 'loading') {
      return;
    }

    if (status === 'unauthenticated' && !session) {
      setTimeout(() => {
        if (status === 'unauthenticated' && !session) {
          router.push(failRedirectRoute);
        }
      }, 50);
      return;
    }

    if (session?.user?.id) {
      getActiveUser(session.user.id);
    }

    return () => {
      cancelled = true;
    };
  }, [session, status, router, failRedirectRoute]);

  return { user, loading };
}
