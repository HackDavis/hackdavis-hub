'use client';

import randomizeProjects from '@utils/grouping/randomizeProjects';

export default function Page() {
  const handleClick = async () => {
    const result = await randomizeProjects();
    console.log(result.body);
  };

  return (
    <div>
      <button onClick={handleClick}>Randomize Projects</button>
    </div>
  );
}
