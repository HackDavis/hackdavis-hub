'use client';

import randomizeProjects from '@utils/matching/randomizeProjects';
import { useState } from 'react';

export default function Page() {
  const [missingTeams, setMissingTeams] = useState<string | null>(null);
  const handleClick = async () => {
    const submissionsWithoutTeams = await randomizeProjects();
    setMissingTeams(JSON.stringify(submissionsWithoutTeams.body, null, 2));
  };
  return (
    <div>
      <button onClick={handleClick}>Randomize Projects</button>
      <p>The following submissions don't have a team associated with them:</p>
      {missingTeams && <pre>{missingTeams}</pre>}
    </div>
  );
}
