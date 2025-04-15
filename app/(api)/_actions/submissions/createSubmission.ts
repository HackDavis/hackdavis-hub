"use server";

import { CreateSubmission } from "@datalib/submissions/createSubmission";

export async function createSubmission(judge_id: string, team_id: string) {
  await CreateSubmission({
    judge_id: {
      "*convertId": {
        id: judge_id,
      },
    },
    team_id: {
      "*convertId": {
        id: team_id,
      },
    },
  });
}
