'use server';

import matchAllTeams from '@utils/grouping/matchingAlgorithm';

export default async function matchTeams() {
  // Generate submissions based on judge-team assignments and save them to CSV.
  const submissions = await matchAllTeams();

  return JSON.stringify(submissions);
}
