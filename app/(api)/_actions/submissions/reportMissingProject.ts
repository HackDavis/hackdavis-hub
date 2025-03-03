'use server';

import { UpdateSubmission } from '@datalib/submissions/updateSubmission';
import { getDatabase } from '@utils/mongodb/mongoClient.mjs';
import { ObjectId } from 'mongodb';

export async function reportMissingProject(
  judgeId: string,
  teamId: string,
  currentPosition: number
) {
  try {
    const db = await getDatabase();

    const allSubmissions = await db
      .collection('submissions')
      .find({
        judge_id: new ObjectId(judgeId),
        is_scored: false,
      })
      .toArray();

    const maxPosition = Math.max(
      ...allSubmissions.map((sub: any) => sub.queuePosition)
    );

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

    await db
      .collection('teams')
      .updateOne({ _id: new ObjectId(teamId) }, { $set: { active: false } });

    return {
      ok: true,
      body: 'Project marked as missing and moved to the end of the queue',
      error: null,
    };
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
