"use server";

import { CreatePanel } from "@datalib/panels/createPanels";

export async function createPanel(trackName: string) {
  const response = await CreatePanel(trackName);
  return JSON.parse(JSON.stringify(response));
}
