'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useRolloutCheck from '@pages/_hooks/useRolloutCheck';

// implements rollout re-check for server components
export default function RolloutWaiter({
  component_key,
  children,
}: {
  component_key: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { ready } = useRolloutCheck(component_key);

  useEffect(() => {
    if (ready) {
      router.refresh();
    }
  }, [ready, router]);

  return <>{children}</>;
}
