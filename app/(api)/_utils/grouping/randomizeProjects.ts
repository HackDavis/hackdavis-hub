import { getManySubmissions } from '@actions/submissions/getSubmission';
import { getManyUsers } from '@actions/users/getUser';

function shuffle(array: any[]) {
  let currentIndex = array.length;

  while (currentIndex != 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
}

export default async function randomizeProjects() {
  try {
    const usersRes = await getManyUsers({
      role: 'judge',
    });

    if (!usersRes.ok) {
      throw new Error(usersRes.error ?? 'Error fetching judges.');
    }

    const judges = usersRes.body;

    for (const judge of judges) {
      const subRes = await getManySubmissions({
        judge_id: judge._id,
      });

      if (!subRes.ok) {
        throw new Error(
          subRes.error ?? `Error getting submissions of judge ${judge._id}`
        );
      }

      const submissions = subRes.body;

      shuffle(submissions);
    }

    return {
      ok: true,
      body: usersRes.body,
      error: null,
    };
  } catch (e) {
    const error = e as Error;
    return {
      ok: false,
      body: null,
      error: error.message,
    };
  }
}
