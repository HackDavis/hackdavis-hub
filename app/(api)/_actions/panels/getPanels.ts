'use server';
import { GetManyPanels } from '@datalib/panels/getPanels';

export async function getAllPanels() {
  const panelsRes = await GetManyPanels();
  return JSON.parse(JSON.stringify(panelsRes));
}
