'use server';

import { CreateSubmission } from '@datalib/submissions/createSubmission';

export async function createSubmission(body: object) {
  return CreateSubmission(body);
}
