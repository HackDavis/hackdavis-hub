'use client';

import { useState, useEffect } from 'react';
import { getManyAnnouncements } from '@actions/announcements/getAnnouncement';

export function useAnnouncements(): any {
  const [announcements, setAnnouncements] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const getAnnouncements = async () => {
    const res = await getManyAnnouncements();
    setAnnouncements(res);
    setLoading(false);
  };

  useEffect(() => {
    getAnnouncements();
  }, []);

  return { announcements, loading, getAnnouncements };
}
