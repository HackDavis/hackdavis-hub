import { ObjectId } from 'mongodb';
import { getDatabase } from '@utils/mongodb/mongoClient.mjs';
import { UpdateSubmission } from '@datalib/submissions/updateSubmission';
import { HttpError } from '@utils/response/Errors';

export const ReportMissingProject = async (
  judgeId: string,
  teamId: string,
  currentPosition: number
) => {
  try {
    const db = await getDatabase();

    // Get all submissions for this judge to find the max queue position
    const allSubmissions = await db
      .collection('submissions')
      .find({
        judge_id: new ObjectId(judgeId),
        is_scored: false,
      })
      .toArray();

    if (allSubmissions.length === 0) {
      return {
        ok: false,
        body: null,
        error: 'No unjudged submissions found for this judge',
      };
    }

    const maxPosition = Math.max(
      ...allSubmissions.map((sub: any) => sub.queuePosition)
    );

    // Update all submissions that were after this one in the queue
    await db.collection('submissions').updateMany(
      {
        judge_id: new ObjectId(judgeId),
        queuePosition: { $gt: currentPosition },
        is_scored: false,
      },
      {
        $inc: { queuePosition: -1 },
      }
    );

    // Move the current submission to the end of the queue
    const updateSubmissionBody = {
      $set: {
        queuePosition: maxPosition,
      },
    };

    const submissionResult = await UpdateSubmission(
      judgeId,
      teamId,
      updateSubmissionBody
    );

    if (!submissionResult.ok) {
      return submissionResult;
    }

    // Mark the team as inactive
    const teamUpdateResult = await db
      .collection('teams')
      .updateOne({ _id: new ObjectId(teamId) }, { $set: { active: false } });

    if (teamUpdateResult.matchedCount === 0) {
      return {
        ok: false,
        body: null,
        error: `Team with id ${teamId} not found`,
      };
    }

    return {
      ok: true,
      body: 'Project marked as missing and moved to the end of the queue',
      error: null,
    };
  } catch (e) {
    const error = e as HttpError;
    return {
      ok: false,
      body: null,
      error: error.message,
    };
  }
};
