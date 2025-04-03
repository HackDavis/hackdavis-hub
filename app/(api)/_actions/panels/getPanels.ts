'use server';
import { GetAllPanels } from '@datalib/panels/createPanels';

export async function getAllPanels() {
  const panelsRes = await GetAllPanels();
  return panelsRes;
}
