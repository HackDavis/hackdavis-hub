import JudgeToTeam from '@typeDefs/judgeToTeam';
import { getDatabase } from '@utils/mongodb/mongoClient.mjs';
import { HttpError } from '@utils/response/Errors';
import Submission from '@typeDefs/submission';

export const GetJudgeToTeamPairings = async () => {
  try {
    const db = await getDatabase();
    const submissions = await db.collection('submissions').find().toArray();
    const pairings = submissions.map((submission: Submission) => ({
      judge_id: String(submission.judge_id),
      team_id: String(submission.team_id),
    }));
    return { ok: true, body: pairings as JudgeToTeam[], error: null };
  } catch (e) {
    const error = e as HttpError;
    return { ok: false, body: null, error: error.message };
  }
};
