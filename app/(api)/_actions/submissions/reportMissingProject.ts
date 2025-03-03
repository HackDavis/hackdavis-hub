'use server';

import { ReportMissingProject } from '@datalib/submissions/reportMissingProject';

export async function reportMissingProject(
  judgeId: string,
  teamId: string,
  currentPosition: number
) {
  try {
    const result = await ReportMissingProject(judgeId, teamId, currentPosition);
    return result;
  } catch (error) {
    console.error('Error reporting missing project:', error);
    return {
      ok: false,
      body: null,
      error:
        error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}
