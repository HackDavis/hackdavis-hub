'use server';

import { generateAndSaveSubmissions } from '@utils/grouping/matchingAlgorithm';

export default async function matchTeams() {
  // Generate submissions based on judge-team assignments and save them to CSV.
  const submissions = await generateAndSaveSubmissions();

  return `Successfully matched teams! Matches: ${JSON.stringify(
    submissions
  )}. Submissions saved to CSV.`;
}
