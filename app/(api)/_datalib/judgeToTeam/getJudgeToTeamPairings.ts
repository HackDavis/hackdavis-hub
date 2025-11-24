import JudgeToTeam from '@typeDefs/judgeToTeam';
import { getDatabase } from '@utils/mongodb/mongoClient.mjs';
import parseAndReplace from '@utils/request/parseAndReplace';
import { HttpError } from '@utils/response/Errors';
import { ObjectId } from 'mongodb';
import Submission from '@typeDefs/submission';

export const GetJudgeToTeamPairings = async () => {
    try {
        const db = await getDatabase();
        const submissions = await db
            .collection('submissions') 
            .find()
            .toArray();
        
        const pairings = submissions.map((submission: Submission) => ({ 
            judge_id: String(submission.judge_id), 
            team_id: String(submission.team_id)
        }));
        // erm im not sure if i did this right??

        return { ok: true, body: pairings as JudgeToTeam[], error: null}; // um not sure if the format in the db is the exact same as the judgetoteam??
    } catch (e) {
        const error = e as HttpError;
        return { ok: false, body: null, error: error.message };
    }
}

