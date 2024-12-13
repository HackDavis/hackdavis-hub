'use server';

import { CreateManyTeams } from '@datalib/teams/createTeams';
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
}
