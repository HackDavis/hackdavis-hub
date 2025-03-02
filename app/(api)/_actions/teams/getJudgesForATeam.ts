'use server';

import Submission from '@app/_types/submission';
import { GetManySubmissions } from '@datalib/submissions/getSubmissions';

// import parseAndReplace from '@utils/request/parseAndReplace';

export async function getJudgesForATeam(team_id: string) {
  const submissions = await GetManySubmissions({ team_id: team_id });
  const judges = submissions.body.map(
    (submission: Submission) => submission.judge_id
  );
  return judges;
}

// export async function getManyTeams(query: object = {}) {
//   const newQuery = await parseAndReplace(query);
//   const teams = await GetManyTeams(newQuery);
//   return teams;
// }
