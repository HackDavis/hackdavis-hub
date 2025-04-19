'use client';

import { getManySubmissions } from '@actions/submissions/getSubmission';
import { useEffect, useState } from 'react';

export function useSubmissions() {
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<any>(null);

  const fetchSubmissions = async () => {
    const submissionsRes = await getManySubmissions();
    setSubmissions(submissionsRes);
    setLoading(false);
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  return { loading, submissions, fetchSubmissions };
}
