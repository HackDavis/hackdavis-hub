'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

import { getManyPanels } from '@actions/panels/getPanels';
import Panel from '@typeDefs/panel';

export function usePanel(): any {
  const { data: session, status } = useSession();
  const user = session?.user;
  const [panel, setPanel] = useState<Panel | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const getPanelWrapper = async (judge_id: string) => {
      const panels = await getManyPanels({
        user_ids: { '*convertId': { id: judge_id } },
      });
      if (panels.ok && panels.body.length !== 0) setPanel(panels.body[0]);
      setLoading(false);
    };
    if (status === 'authenticated' && user) {
      getPanelWrapper(user.id ?? '');
    }
  }, [status, user]);

  return { panel, loading };
}
