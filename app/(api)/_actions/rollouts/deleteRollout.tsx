'use server';

import DeleteRollout from '@datalib/rollouts/deleteRollout';
import parseAndReplace from '@utils/request/parseAndReplace';

export const deleteRollout = async (id: string) => {
  return await DeleteRollout(id);
};

