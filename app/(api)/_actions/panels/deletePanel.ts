'use server';

import { DeleteManyPanels, DeletePanel } from '@datalib/panels/deletePanel';
import parseAndReplace from '@utils/request/parseAndReplace';

export const deleteManyPanels = async (query: object = {}) => {
  const parsedQuery = await parseAndReplace(query);
  return await DeleteManyPanels(parsedQuery);
};

export const deletePanel = async (id: string) => await DeletePanel(id);
