'use client';

import Loader from '@pages/_components/Loader/Loader';
import randomizeProjects from '@utils/matching/randomizeProjects';
import { FormEvent, useState } from 'react';

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [missingTeams, setMissingTeams] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      setLoading(true);
      setError('');
      setMissingTeams(null);

      const formData = new FormData(e.currentTarget);
      const secondFloor = parseInt(formData.get('secondFloor') as string);
      if (isNaN(secondFloor)) throw new Error('Enter an integer.');

      const submissionsWithoutTeams = await randomizeProjects(secondFloor);
      setMissingTeams(JSON.stringify(submissionsWithoutTeams.body, null, 2));
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    }

    setLoading(false);
  };

  return (
    <div>
      <p style={{ color: 'red' }}>{error}</p>
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        <label htmlFor="secondFloor">
          Input the smallest (first) table number on the second floor:
        </label>
        <input name="secondFloor" type="text" />
        <button type="submit">Randomize Projects</button>
      </form>
      <p>The following submissions don't have a team associated with them:</p>
      {missingTeams && <pre>{missingTeams}</pre>}

      {loading && <Loader />}
    </div>
  );
}
