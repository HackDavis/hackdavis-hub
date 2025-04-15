"use server";

import { UpdateSubmission } from "@datalib/submissions/updateSubmission";

export async function updateTeam(
  judgeId: string,
  teamId: string,
  updateData: any,
) {
  try {
    const result = await UpdateSubmission(judgeId, teamId, updateData);
    return result;
  } catch (error) {
    console.error("Error updating team:", error);
    return {
      ok: false,
      body: null,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
