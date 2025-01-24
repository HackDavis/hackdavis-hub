'use server';

import { CreateManyTeams } from '@datalib/teams/createTeams';
<<<<<<< HEAD
import parsedRecord from '@typeDefs/parsedRecord';

export default async function ingestCSV(parsedData: parsedRecord[]) {
  const res = await CreateManyTeams(parsedData);
  return { ok: res.ok, error: res.error };
=======
import csvAlgorithm from '@utils/csv-ingestion/csvAlgorithm';

export default async function ingestCSV(formData: FormData) {
  const file = formData.get('file') as File;
  const data = await file.arrayBuffer();
  const blob = new Blob([data], { type: file.type });

  const csvRes = await csvAlgorithm(blob);
  if (csvRes.ok && csvRes.body) {
    const res = await CreateManyTeams(csvRes.body);
    return res;
  }

  return csvRes;
>>>>>>> 95b4e4b5adb199a409d29786cc4d53cbe5e0ba0c
}
