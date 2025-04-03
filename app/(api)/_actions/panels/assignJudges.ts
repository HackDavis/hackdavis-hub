'use server';

import { AssignJudgesToPanels } from '@datalib/panels/createPanels';

export async function assignJudgesToPanels() {
  const response = await AssignJudgesToPanels();
  return response;
}
