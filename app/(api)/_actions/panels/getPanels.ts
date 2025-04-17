'use server';
import { GetManyPanels, GetPanel } from '@datalib/panels/getPanels';
import parseAndReplace from '@utils/request/parseAndReplace';

export async function getManyPanels(query: object = {}) {
  const parsedQuery = await parseAndReplace(query);
  const panelsRes = await GetManyPanels(parsedQuery);
  return JSON.parse(JSON.stringify(panelsRes));
}

export async function getPanel(id: string) {
  const team = await GetPanel(id);
  return JSON.parse(JSON.stringify(team));
}
