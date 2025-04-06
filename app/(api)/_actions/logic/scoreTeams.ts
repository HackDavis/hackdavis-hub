'use server';

import { getManySubmissions } from '@actions/submissions/getSubmission';
import Submission from '@typeDefs/submission';
import rankTeams from '@utils/scoring/rankTeams';

export default async function scoreTeams() {
  // Get all submissions (no need to pass teams)
  const submissions: Submission[] = (await getManySubmissions()).body;

  return rankTeams({ submissions });
}
