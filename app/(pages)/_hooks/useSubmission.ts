'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

import { getSubmission } from '@actions/submissions/getSubmission';

export function useSubmission(team_id: string): any {
  const { data: session, status } = useSession();
  const user = session?.user;
  const [submission, setSubmssion] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const getSubmissionWrapper = async (judge_id: string) => {
      const submission = await getSubmission(judge_id, team_id);
      setSubmssion(submission);
      setLoading(false);
    };
    if (status === 'authenticated' && user) {
      getSubmissionWrapper(user.id ?? '');
    }
  }, [status, user, team_id]);

  return { submission, loading };
}
