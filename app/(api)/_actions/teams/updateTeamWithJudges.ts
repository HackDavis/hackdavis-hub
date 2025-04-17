'use server';

import User from '@typeDefs/user';
import Submission from '@typeDefs/submission';
import HttpError from '@utils/response/HttpError';

import { UpdateTeam } from '@datalib/teams/updateTeam';
import { CreateSubmission } from '@datalib/submissions/createSubmission';
import { GetManySubmissions } from '@datalib/submissions/getSubmissions';
import { DeleteSubmission } from '@datalib/submissions/deleteSubmission';

export async function updateTeamWithJudges(
  team_id: string,
  body: any,
  judges: User[]
) {
  try {
    // update native fields in judge object
    const updateRes = await UpdateTeam(team_id, body);
    if (!updateRes.ok) {
      throw new Error(updateRes.error ?? '');
    }

    // fetch all submissions the team is associated with
    const teamSubmissions = await GetManySubmissions({
      team_id: {
        '*convertId': {
          id: team_id,
        },
      },
    });
    if (!teamSubmissions.ok) {
      throw new Error(teamSubmissions?.error ?? '');
    }

    // create judge_id[] for current state and future state for judge teams
    const currentTeamJudges: string[] = teamSubmissions.body.map(
      (submission: Submission) => submission.judge_id
    );

    const newTeamJudges = judges.map((judge: User) => judge._id ?? '');

    // create lists of judges to perform delete and create on
    const deleteList = currentTeamJudges.filter(
      (id: string) => !newTeamJudges.includes(id)
    );

    const createList = newTeamJudges.filter(
      (id: string) => !currentTeamJudges.includes(id)
    );

    const createSubmissionsResList = await Promise.all(
      createList.map((judge_id) =>
        CreateSubmission({
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
        })
      )
    );

    if (!createSubmissionsResList.every((res: any) => res.ok)) {
      throw new Error(
        'Some creates failed: \n' + JSON.stringify(createSubmissionsResList)
      );
    }

    const deleteSubmissionResList = await Promise.all(
      deleteList.map((judge_id) => DeleteSubmission(judge_id, team_id))
    );

    if (!deleteSubmissionResList.every((res: any) => res.ok)) {
      throw new Error(
        'Some deletes failed: \n' + JSON.stringify(deleteSubmissionResList)
      );
    }

    return {
      ok: true,
      body: {
        updateRes,
        createSubmissionsResList,
        deleteSubmissionResList,
      },
      error: null,
    };
  } catch (e) {
    const error = e as HttpError;
    return { ok: false, body: null, error: error.message };
  }
}
