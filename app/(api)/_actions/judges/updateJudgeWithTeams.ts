'use server';

import Team from '@typeDefs/team';
import Submission from '@typeDefs/submission';
import HttpError from '@utils/response/HttpError';

import { UpdateUser } from '@datalib/users/updateUser';
import { CreateSubmission } from '@datalib/submissions/createSubmission';
import { GetManySubmissions } from '@datalib/submissions/getSubmissions';
import { UpdateSubmission } from '@datalib/submissions/updateSubmission';
import { DeleteSubmission } from '@datalib/submissions/deleteSubmission';

export async function updateJudgeWithTeams(
  judge_id: string,
  body: any,
  teams: Team[]
) {
  try {
    // update native fields in judge object
    const updateRes = await UpdateUser(judge_id, body);
    if (!updateRes.ok) {
      throw new Error(updateRes.error ?? '');
    }

    // fetch all submissions the judge is responsible for
    const judgeSubmissions = await GetManySubmissions({
      judge_id: {
        '*convertId': {
          id: judge_id,
        },
      },
    });
    if (!judgeSubmissions.ok) {
      throw new Error(judgeSubmissions?.error ?? '');
    }

    // create team_id[] for current state and future state for judge teams
    const currentJudgeTeams: string[] = judgeSubmissions.body.map(
      (submission: Submission) => submission.team_id.toString()
    );

    const newJudgeTeams = teams.map((team: Team) => team._id ?? '');

    // maps team_id to queuePosition
    const teamOrderMap = Object.fromEntries(
      teams.map((team: Team, index: number) => [team._id, index])
    );

    // create lists of teams to perform: update, delete, create on
    const updateList = newJudgeTeams.filter((id: string) =>
      currentJudgeTeams.includes(id)
    );

    const deleteList = currentJudgeTeams.filter(
      (id: string) => !newJudgeTeams.includes(id)
    );

    const createList = newJudgeTeams.filter(
      (id: string) => !currentJudgeTeams.includes(id)
    );

    const updateSubmissionsResList = await Promise.all(
      updateList.map((team_id) =>
        UpdateSubmission(judge_id, team_id, {
          $set: {
            queuePosition: teamOrderMap[team_id],
          },
        })
      )
    );

    if (!updateSubmissionsResList.every((res: any) => res.ok)) {
      throw new Error(
        'Some updates failed: \n' + JSON.stringify(updateSubmissionsResList)
      );
    }

    const createSubmissionsResList = await Promise.all(
      createList.map((team_id) =>
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
          queuePosition: teamOrderMap[team_id],
        })
      )
    );

    if (!createSubmissionsResList.every((res: any) => res.ok)) {
      throw new Error(
        'Some creates failed: \n' + JSON.stringify(createSubmissionsResList)
      );
    }

    const deleteSubmissionResList = await Promise.all(
      deleteList.map((team_id) => DeleteSubmission(judge_id, team_id))
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
        updateSubmissionsResList,
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
