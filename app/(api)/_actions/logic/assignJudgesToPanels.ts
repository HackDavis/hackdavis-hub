"use server";

import { GetManyPanels } from "@datalib/panels/getPanels";
import { GetManyUsers } from "@datalib/users/getUser";
import judgeToPanelAlgorithm from "@utils/matching/judgeToPanelAlgorithm";
import { categorizedTracks } from "@data/tracks";
import { CreateManyPanels } from "@datalib/panels/createPanels";
import { UpdatePanel } from "@datalib/panels/updatePanel";
import Panel from "@typeDefs/panel";

async function initializeEmptyPanels() {
  const panelData: Panel[] = Object.values(categorizedTracks).map((track) => ({
    track: track.name,
    domain: track.domain ?? "",
    user_ids: [],
  }));
  const response = await CreateManyPanels(panelData);
  return JSON.parse(JSON.stringify(response));
}

export default async function assignJudgesToPanels(maxPanelSize: number = 5) {
  const initRes = await initializeEmptyPanels();
  if (!initRes.ok) {
    initRes.error = `Failed to initialize empty panels: ${initRes.error}`;
    return initRes;
  }

  const panelsRes = await GetManyPanels({});
  if (!panelsRes.ok || panelsRes.body.length === 0) {
    return {
      ok: false,
      body: null,
      error: `Failed to get panels: ${panelsRes.error ?? "No panels found"}`,
    };
  }

  const judgesRes = await GetManyUsers({ role: "judge" });
  if (!judgesRes.ok || judgesRes.body.length === 0) {
    return {
      ok: false,
      body: null,
      error: `Failed to get judges: ${judgesRes.error ?? "No judges found"}`,
    };
  }

  const response = await judgeToPanelAlgorithm(
    panelsRes.body,
    judgesRes.body,
    maxPanelSize,
  );
  if (!response) {
    return {
      ok: false,
      body: response,
      error: `Not enough judges for panels of size ${maxPanelSize}. Reduce maxPanelSize, delete all panels and try again.`,
    };
  }

  const panelUpdates = response.map(async (panel: Panel) => {
    if (!panel._id)
      return {
        ok: false,
        body: null,
        error: "Panel ID not found during update",
      };
    const { _id: _, track: __, users: ___, ...rest } = panel;
    return await UpdatePanel(panel._id, { $set: rest });
  });

  const panelUpdateRes = await Promise.all(panelUpdates);
  for (const res of panelUpdateRes) {
    if (!res.ok) {
      res.error = `Failed to update panel after assignment: ${res.error}`;
      return res;
    }
  }

  return JSON.parse(JSON.stringify(await GetManyPanels({})));
}
