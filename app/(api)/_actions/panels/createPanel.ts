'use server';

import { CreatePanel } from '@datalib/panels/createPanels';

export async function createPanel(trackName: string, trackType: string) {
  const response = await CreatePanel(trackName, trackType);
  return response;
}
