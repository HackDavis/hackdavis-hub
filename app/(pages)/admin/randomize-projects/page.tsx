'use client';

import randomizeProjects from '@utils/grouping/randomizeProjects';

export default function Page() {
  return (
    <div>
      <button onClick={randomizeProjects}>Randomize Projects</button>
    </div>
  );
}
