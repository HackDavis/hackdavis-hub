'use server';

// import matchingAlgorithm from '@utils/grouping/matchingAlgorithm';
// import JudgeGroupToTeam from '@typeDefs/judgeToTeam';
// import parseAndReplace from '@utils/request/parseAndReplace';
// import { getManyTeams } from '@actions/teams/getTeams';
// import { createSubmission } from '@actions/submissions/createSubmission';
// import { getManyJudges } from '@actions/judges/getJudge';

// TODO: Refactor for 2025

// function checkMatches(matches: JudgeGroupToTeam[], teamsLength: number) {
//   if (matches.length < 2 * teamsLength) return false;

//   let valid = true;
//   const mp: Map<string, number> = new Map();
//   for (const match of matches) {
//     if (mp.get(match.team_id.toString()) === undefined) {
//       mp.set(match.team_id.toString(), 1);
//     } else {
//       mp.set(match.team_id.toString(), mp.get(match.team_id.toString())! + 1);
//     }
//   }

//   mp.forEach((count) => {
//     if (count !== 2) valid = false;
//   });

//   return valid;
// }

export default async function matchTeams() {
  // const judgeGroups = (await getManyJudgeGroups()).body;
  // const teams = (await getManyTeams()).body;
  // const matches = matchingAlgorithm(judgeGroups, teams);
  // const parsedMatches = await parseAndReplace(matches);
  // const valid = checkMatches(parsedMatches, teams.length);
  // if (valid) {
  //   await LinkManyJudgeGroupsToTeams(matches);
  //   for (const match of parsedMatches) {
  //     const judges = (
  //       await getManyJudges({
  //         judge_group_id: match.judge_group_id,
  //       })
  //     ).body;
  //     for (const judge of judges) {
  //       await createSubmission(judge._id, match.team_id.toString());
  //     }
  //   }
  return 'Successfully matched teams!';
  // } else {
  //   return 'Failed to match teams: There may be fewer than two judge groups in one or more specialties.';
  // }
}
