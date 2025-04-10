'use server';

import { UpdatePanel } from '@datalib/panels/updatePanel';
import Panel from '@typeDefs/panel';

export default async function updatePanel(track: string, body: Panel) {
  const { _id: _, track: __, users: ___, ...rest } = body;
  return await UpdatePanel(track, { $set: rest });
}
