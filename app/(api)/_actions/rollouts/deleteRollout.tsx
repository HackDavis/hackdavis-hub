'use server';

import DeleteRollout from '@datalib/rollouts/deleteRollout';

export const deleteRollout = async (id: string) => {
  return DeleteRollout(id);
};
