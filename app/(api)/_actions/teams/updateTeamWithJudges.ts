'use server';

import User from '@typeDefs/user';
import Submission from '@typeDefs/submission';
import HttpError from '@utils/response/HttpError';

import { UpdateTeam } from '@datalib/teams/updateTeam';
import { CreateSubmission } from '@datalib/submissions/createSubmission';
import { GetManySubmissions } from '@datalib/submissions/getSubmissions';
import { DeleteSubmission } from '@datalib/submissions/deleteSubmission';
import { UpdateSubmission } from '@datalib/submissions/updateSubmission';

export async function addJudgeToTeam(team_id: string, judge_id: string) {
  try {
    const submissionsRes = await GetManySubmissions({
      judge_id: {
        '*convertId': {
          id: judge_id,
        },
      },
    });
    if (!submissionsRes.ok) {
      throw new Error(submissionsRes?.error ?? '');
    }
    const submissions = submissionsRes.body;
    const numTeamsToJudge = submissions.length;

    const createRes = await CreateSubmission({
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
      queuePosition: numTeamsToJudge,
    });

    if (!createRes.ok) {
      throw new Error(createRes?.error ?? '');
    }

    return createRes;
  } catch (e) {
    const error = e as HttpError;
    return { ok: false, body: null, error: error.message };
  }
}

export async function removeJudgeFromTeam(team_id: string, judge_id: string) {
  try {
    const submissionsRes = await GetManySubmissions({
      judge_id: {
        '*convertId': {
          id: judge_id,
        },
      },
    });
    if (!submissionsRes.ok) {
      throw new Error(submissionsRes?.error ?? '');
    }
    const submissions: Submission[] = submissionsRes.body;
    const sortedSubmissions = submissions.sort(
      (a: Submission, b: Submission) =>
        (a.queuePosition ?? 0) - (b.queuePosition ?? 0)
    );

    const removeIndex = sortedSubmissions.findIndex(
      (sub: Submission) => sub.team_id === team_id
    );

    if (removeIndex === -1) {
      throw new Error(
        `Submission with judge_id: ${judge_id} and team_id: ${team_id} not found`
      );
    }

    const deleteRes = await DeleteSubmission(judge_id, team_id);
    if (!deleteRes.ok) {
      throw new Error(deleteRes?.error ?? '');
    }

    const positionDecrementList = sortedSubmissions.slice(removeIndex + 1);
    const decrementResList = await Promise.all(
      positionDecrementList.map((sub: Submission) =>
        UpdateSubmission(sub.judge_id, sub.team_id, {
          $inc: { queuePosition: -1 },
        })
      )
    );

    if (!decrementResList.every((res: any) => res.ok)) {
      throw new Error(
        `Updating submission positions failed.\n${JSON.stringify(
          decrementResList
        )}`
      );
    }

    return {
      ok: true,
      body: { deleteRes, positionDecrementList },
      error: null,
    };
  } catch (e) {
    const error = e as HttpError;
    return { ok: false, body: null, error: error.message };
  }
}

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
      (submission: Submission) => submission.judge_id.toString()
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
      createList.map((judge_id) => addJudgeToTeam(team_id, judge_id))
    );
    if (!createSubmissionsResList.every((res: any) => res.ok)) {
      throw new Error(
        'Some creates failed: \n' + JSON.stringify(createSubmissionsResList)
      );
    }

    const deleteSubmissionResList = await Promise.all(
      deleteList.map((judge_id) => removeJudgeFromTeam(judge_id, team_id))
    );
    if (!deleteSubmissionResList.every((res: any) => res.ok)) {
      throw new Error(
        'Some deletes failed: \n' + JSON.stringify(deleteSubmissionResList)
      );
    }

    return JSON.parse(
      JSON.stringify({
        ok: true,
        body: {
          updateRes,
          createSubmissionsResList,
          deleteSubmissionResList,
        },
        error: null,
      })
    );
  } catch (e) {
    const error = e as HttpError;
    return JSON.parse(
      JSON.stringify({ ok: false, body: null, error: error.message })
    );
  }
}
