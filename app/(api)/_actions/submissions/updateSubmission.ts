'use server';
import FormToJSON from '@utils/form/FormToJSON';
import { UpdateSubmission } from '@datalib/submissions/updateSubmission';

export default async function updateSubmission(
  prevState: any,
  formData: FormData
) {
  const { judge_id, team_id, comments, ...rest } = FormToJSON(formData);
  const keys = Object.keys(rest);
  const scores = keys.slice(0, 5).map((key: string) => +rest[key]);
  const correlations = keys.slice(5).map((key: string) => ({
    track: Buffer.from(key, 'ascii').toString('utf-8'),
    score: +rest[key],
  }));

  const updateBody = {
    $set: {
      scores,
      correlations,
      comments,
    },
  };

  const updateRes = await UpdateSubmission(judge_id, team_id, updateBody);
  return updateRes;
}
