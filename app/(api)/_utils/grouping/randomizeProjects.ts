import bulkWriteCollection from '@actions/bulkWrite/bulkWriteCollection';
import { getManySubmissions } from '@actions/submissions/getSubmission';
import { getManyUsers } from '@actions/users/getUser';
import Submission from '@typeDefs/submission';
import User from '@typeDefs/user';

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

    const judges: User[] = usersRes.body;

    for (const judge of judges) {
      const subRes = await getManySubmissions({
        judge_id: {
          '*convertId': {
            id: judge._id,
          },
        },
      });

      if (!subRes.ok) {
        throw new Error(
          subRes.error ?? `Error getting submissions of judge ${judge._id}`
        );
      }

      const submissions: Submission[] = subRes.body;
      shuffle(submissions);

      const updatedSubmissions = submissions.map(
        (submission: Submission, index: number) => ({
          updateOne: {
            filter: {
              _id: {
                '*convertId': {
                  id: submission._id,
                },
              },
            },
            update: { $set: { queuePosition: index } },
          },
        })
      );

      const updateRes = await bulkWriteCollection(
        'submissions',
        updatedSubmissions
      );

      if (!updateRes.ok) {
        throw new Error(
          updateRes.error ?? `Error shuffling submissions of judge ${judge._id}`
        );
      }
    }

    return {
      ok: true,
      body: null,
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
