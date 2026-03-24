import Submission from '@typeDefs/submission';
import Team from '@typeDefs/team';
import { getManySubmissions } from '@actions/submissions/getSubmission';
import { getManyTeams } from '@actions/teams/getTeams';
import bulkWriteCollection from '@actions/bulkWrite/bulkWriteCollection';

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

const groupByJudge = (
  acc: Record<string, Submission[]>,
  submission: Submission
) => {
  if (!acc[submission.judge_id]) {
    acc[submission.judge_id] = [];
  }
  acc[submission.judge_id].push(submission);
  return acc;
};

// Helper to convert table letter-number format to a comparable numeric value (ex: A1 -> 1001, B3 -> 2003)
function toComparableTableNumber(tableNumber: string): number | null {
  const raw = tableNumber.trim();
  if (!raw) return null;

  // If table number is already numeric
  const numeric = Number(raw);
  if (Number.isFinite(numeric)) return numeric;

  const match = raw.match(/^([A-Za-z]+)(\d+)$/);
  if (!match) return null;

  const row = match[1].toUpperCase();
  const seat = Number(match[2]);
  const rowValue = row.charCodeAt(0) - 64;
  return rowValue * 1000 + seat;
}

export default async function randomizeProjects(
  // I1 is the first table on floor 2.
  secondFloorStart: number = 9001
) {
  try {
    const subRes = await getManySubmissions();

    if (!subRes.ok) {
      throw new Error(subRes.error ?? 'Error getting submissions');
    }

    const submissions = subRes.body;

    const submissionsByJudge: Record<string, Submission[]> = submissions.reduce(
      groupByJudge,
      {} as Record<string, Submission[]>
    );

    const teamRes = await getManyTeams();

    if (!teamRes.ok) {
      throw new Error(teamRes.error ?? 'Error getting teams');
    }

    const teams: Team[] = teamRes.body;

    const tableNumbers = new Map<string, string>();
    for (const team of teams) {
      if (team._id) tableNumbers.set(team._id, team.tableNumber);
    }

    const updatedSubmissions: object[] = [];
    const submissionsWithoutTeams: Submission[] = [];

    for (const submissions of Object.values(submissionsByJudge)) {
      const floor = Object.groupBy(submissions, ({ team_id }) => {
        const tableNumber = tableNumbers.get(team_id);
        if (!tableNumber) return 'missing';

        const comparable = toComparableTableNumber(tableNumber);
        if (comparable === null) return 'missing';

        return comparable < secondFloorStart ? 'first' : 'second';
      });

      const missing = floor.missing;
      if (missing) submissionsWithoutTeams.push(...missing);

      const firstFloor = floor.first;
      const secondFloor = floor.second;

      if (firstFloor) shuffle(firstFloor);
      if (secondFloor) shuffle(secondFloor);

      let queue: Submission[];

      if (firstFloor && !secondFloor) {
        queue = firstFloor;
      } else if (secondFloor && !firstFloor) {
        queue = secondFloor;
      } else if (firstFloor && secondFloor) {
        if (Math.random() < 0.5) {
          queue = firstFloor.concat(secondFloor);
        } else {
          queue = secondFloor.concat(firstFloor);
        }
      } else {
        continue;
      }

      const updateOperations = queue.map(
        (submission: Submission, index: number) => ({
          updateOne: {
            filter: {
              _id: {
                '*convertId': {
                  id: submission._id,
                },
              },
            },
            update: { $set: { queuePosition: index + 1 } },
          },
        })
      );

      updatedSubmissions.push(...updateOperations);
    }

    const updateRes = await bulkWriteCollection(
      'submissions',
      updatedSubmissions
    );

    if (!updateRes.ok) {
      throw new Error(updateRes.error ?? 'Error shuffling some submissions.');
    }

    return {
      ok: true,
      body: {
        submissionsWithoutTeams,
      },
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
