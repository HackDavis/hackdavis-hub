'use server';

import { getManyTeams } from '@actions/teams/getTeams';
import { CreateSubmission } from '@datalib/submissions/createSubmission';
import Submission from '@typeDefs/submission';
// import User from '@typeDefs/user';
import matchAllTeams from '@utils/grouping/matchingAlgorithm';
import parseAndReplace from '@utils/request/parseAndReplace';

function checkMatches(matches: Submission[], teamsLength: number) {
  if (matches.length < 3 * teamsLength) return false;

  let valid = true;
  const mp: Map<string, number> = new Map();
  for (const match of matches) {
    const teamKey = match.team_id.toString();
    if (mp.get(teamKey) === undefined) {
      mp.set(teamKey, 1);
    } else {
      mp.set(teamKey, mp.get(teamKey)! + 1);
    }
  }

  mp.forEach((count) => {
    if (count !== 3) valid = false;
  });

  return valid;
}

export default async function matchTeams(
  options: { alpha: number } = { alpha: 4 }
) {
  // Generate submissions based on judge-team assignments.
  const teams = (await getManyTeams()).body;

  const matchResults = await matchAllTeams({ alpha: options.alpha });
  const submissions = matchResults.submissions;
  const parsedSubmissions = await parseAndReplace(submissions);
  console.log(submissions.length);
  console.log(parsedSubmissions.length);
  console.log(teams.length);
  const valid = checkMatches(parsedSubmissions, teams.length);
  if (valid) {
    for (const submission of submissions) {
      console.log(submission.judge_id);
      const res = await CreateSubmission({
        judge_id: { _id: submission.judge_id },
        team_id: { _id: submission.team_id },
      });
      if (!res.ok) {
        console.error(res.error);
      }
    }
  }

  return JSON.stringify(matchResults);
}
