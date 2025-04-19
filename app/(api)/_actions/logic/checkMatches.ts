import Submission from '@typeDefs/submission';

export default function checkMatches(
  matches: Submission[],
  teamsLength: number
) {
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
