'use client';

import { useState, useEffect } from 'react';
import { getManySubmissions } from '@actions/submissions/getSubmission';

export function useJudgingProgress(): any {
  const [total, setTotal] = useState<number>(1);
  const [finished, setFinished] = useState<number>(0);
  const [percent, setPercent] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const wrapper = async () => {
      const submissions = await getManySubmissions();
      if (submissions.ok) {
        const subs = submissions.body;
        const total = subs.length;
        const finished = subs.filter((sub: { scores?: number[] }) =>
          sub.scores ? true : false
        ).length;
        const percent = Math.round((100 * finished) / total);
        setTotal(total);
        setFinished(finished);
        setPercent(percent);
      }

      setLoading(false);
    };
    wrapper();
  }, []);

  return { total, finished, percent, loading };
}
