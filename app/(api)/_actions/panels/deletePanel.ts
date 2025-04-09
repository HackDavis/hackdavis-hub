import { DeleteManyPanels } from '@datalib/panels/deletePanel';
import parseAndReplace from '@utils/request/parseAndReplace';

export const deletePanels = async (query: object = {}) => {
  const parsedQuery = await parseAndReplace(query);
  return await DeleteManyPanels(parsedQuery);
};
