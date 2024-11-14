'use server';

import csvAlgorithm from '@utils/csv-ingestion/csvAlgorithm';

export default async function uploadFile(formData: FormData) {
  const file = formData.get('file') as File;
  const data = await file.arrayBuffer();
  const blob = new Blob([data], { type: file.type });

  const res = await csvAlgorithm(blob);
  return res;
}
