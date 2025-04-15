"use server";

import { UpdatePanel } from "@datalib/panels/updatePanel";
import Panel from "@typeDefs/panel";

export default async function updatePanel(id: string, body: Panel) {
  const { _id: _, track: __, users: ___, ...rest } = body;
  return await UpdatePanel(id, { $set: rest });
}
