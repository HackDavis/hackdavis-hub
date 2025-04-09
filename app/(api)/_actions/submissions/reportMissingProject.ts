'use server';

import { HttpError } from '@utils/response/Errors';
import { getManySubmissions } from './getSubmission';

// import { ReportMissingProject } from '@datalib/submissions/reportMissingProject';

// export async function reportMissingProject(judge_id: string, team_id: string) {
//   try {
//     const result = await ReportMissingProject(judge_id, team_id);
//     return result;
//   } catch (error) {
//     console.error('Error reporting missing project:', error);
//     return {
//       ok: false,
//       body: null,
//       error:
//         error instanceof Error ? error.message : 'An unknown error occurred',
//     };
//   }
// }

export async function reportMissingProject(judge_id: string, team_id: string) {
  try {
    const submissionsRes = await getManySubmissions({
      judge_id: {
        '*convertId': {
          id: judge_id,
        },
      },
      team_id: {
        '*convertId': {
          id: team_id,
        },
      },
    });

    if (!submissionsRes.ok) {
      throw new Error(submissionsRes.error ?? '');
    }
  } catch (e) {
    const error = e as HttpError;
    return { ok: false, body: null, error: error.message };
  }
}
