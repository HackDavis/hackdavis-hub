'use server';

import { auth } from '@/auth';
import { HttpError, NotAuthenticatedError } from '@utils/response/Errors';
import { GetManySubmissions } from '@datalib/submissions/getSubmissions';
import { UpdateSubmission } from '@datalib/submissions/updateSubmission';
import { UpdateTeam } from '@datalib/teams/updateTeam';
import Submission from '@typeDefs/submission';
import Team from '@typeDefs/team';
import { GetTeam } from '@datalib/teams/getTeam';

export async function reportMissingProject(judge_id: string, team_id: string) {
  try {
    const updateTeamRes = await UpdateTeam(team_id, {
      $push: {
        reports: {
          timestamp: Date.now(),
          judge_id,
        },
      },
    });

    if (!updateTeamRes.ok) {
      throw new Error(updateTeamRes.error ?? '');
    }

    const submissionsRes = JSON.parse(
      JSON.stringify(
        await GetManySubmissions({
          judge_id: {
            '*convertId': {
              id: judge_id,
            },
          },
        })
      )
    );

    if (!submissionsRes.ok) {
      throw new Error(submissionsRes.error ?? '');
    }

    const submissions: Submission[] = submissionsRes.body ?? [];

    const reportIndex = submissions.findIndex(
      (sub: Submission) => sub.team_id === team_id
    );

    if (reportIndex === -1) {
      throw new Error(
        `Submission from judge: ${judge_id} and team: ${team_id} not found.`
      );
    }

    submissions[reportIndex].queuePosition =
      Math.max(
        ...submissions.map((sub: Submission) => sub.queuePosition ?? 0)
      ) + 1;

    const reorderedSubmissions = submissions
      .sort(
        (a: Submission, b: Submission) =>
          (a.queuePosition ?? 0) - (b.queuePosition ?? 0)
      )
      .map((sub: Submission, index: number) => ({
        ...sub,
        queuePosition: index,
      }));

    const reorderResList = await Promise.all(
      reorderedSubmissions.map((sub: Submission) =>
        UpdateSubmission(sub.judge_id, sub.team_id, {
          $set: { queuePosition: sub.queuePosition },
        })
      )
    );

    if (!reorderResList.every((res: any) => res.ok)) {
      throw new Error(
        `Not all submission order updates succeeded\n${JSON.stringify(
          reorderResList
        )}`
      );
    }

    return {
      ok: true,
      body: { updateTeamRes, reorderSubmissionsRes: reorderResList },
      error: null,
    };
  } catch (e) {
    const error = e as HttpError;
    return { ok: false, body: null, error: error.message };
  }
}

export async function restoreMissingTeam(team_id: string) {
  try {
    // This action mutates queue order for multiple judges, so keep it admin-only.
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      throw new NotAuthenticatedError('Access Denied.');
    }

    // Pull current team state so we can restore based on authoritative reports.
    const teamRes = JSON.parse(JSON.stringify(await GetTeam(team_id)));
    if (!teamRes.ok || !teamRes.body) {
      throw new Error(teamRes.error ?? `Team with id: ${team_id} not found.`);
    }

    const team = teamRes.body as Team;
    const reports = team.reports ?? [];
    // Reports can contain duplicates; restore logic should touch each judge once.
    const reporterJudgeIds = [
      ...new Set(
        reports
          .map((report) => String(report.judge_id ?? ''))
          .filter((judge_id) => judge_id.length > 0)
      ),
    ];
    const requeueResults: { judge_id: string; reorderResCount: number }[] = [];

    for (const judge_id of reporterJudgeIds) {
      // Rebuild this judge's queue from submissions so we can safely reindex.
      const submissionsRes = JSON.parse(
        JSON.stringify(
          await GetManySubmissions({
            judge_id: {
              '*convertId': {
                id: judge_id,
              },
            },
          })
        )
      );

      if (!submissionsRes.ok) {
        throw new Error(submissionsRes.error ?? '');
      }

      // Convert ids to strings for reliable equality checks and update calls.
      const submissions: Submission[] = (submissionsRes.body ?? []).map(
        (sub: Submission) => ({
          ...sub,
          judge_id: String(sub.judge_id),
          team_id: String(sub.team_id),
        })
      );

      const targetSubmission = submissions.find(
        (sub: Submission) => sub.team_id === team_id
      );

      // Only move queue position if this judge actually has an unscored target
      // submission. This preserves existing judged work and avoids requeueing
      // judges where the team is not actionable anymore.
      if (!targetSubmission || targetSubmission.is_scored) {
        continue;
      }

      // "Restore" policy: put team at end, then normalize all queue positions.
      targetSubmission.queuePosition =
        Math.max(
          ...submissions.map((sub: Submission) => sub.queuePosition ?? 0)
        ) + 1;

      const reorderedSubmissions = submissions
        .sort(
          (a: Submission, b: Submission) =>
            (a.queuePosition ?? 0) - (b.queuePosition ?? 0)
        )
        .map((sub: Submission, index: number) => ({
          ...sub,
          queuePosition: index,
        }));

      const reorderResList = await Promise.all(
        reorderedSubmissions.map((sub: Submission) =>
          UpdateSubmission(sub.judge_id, sub.team_id, {
            $set: { queuePosition: sub.queuePosition },
          })
        )
      );

      if (!reorderResList.every((res: any) => res.ok)) {
        throw new Error(
          `Not all submission order updates succeeded\n${JSON.stringify(
            reorderResList
          )}`
        );
      }

      requeueResults.push({
        judge_id,
        reorderResCount: reorderResList.length,
      });
    }

    // Once queues are restored, clear reports and only set active when needed.
    const teamUpdate = team.active
      ? { $set: { reports: [] } }
      : { $set: { reports: [], active: true } };

    const updateTeamRes = await UpdateTeam(team_id, teamUpdate);

    if (!updateTeamRes.ok) {
      throw new Error(updateTeamRes.error ?? '');
    }

    return {
      ok: true,
      body: { updateTeamRes, requeueResults },
      error: null,
    };
  } catch (e) {
    const error = e as HttpError;
    return { ok: false, body: null, error: error.message };
  }
}
