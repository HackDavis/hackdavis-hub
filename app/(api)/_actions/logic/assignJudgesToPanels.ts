'use server';

import { GetManyPanels } from '@datalib/panels/getPanels';
import { GetManyUsers } from '@datalib/users/getUser';
import judgeToPanelAlgorithm from '@utils/matching/judgeToPanelAlgorithm';
import { optedHDTracks } from '@data/tracks';
import { CreateManyPanels } from '@datalib/panels/createPanels';
import { UpdatePanel } from '@datalib/panels/updatePanel';
import Panel from '@typeDefs/panel';
import { DeleteManyPanels } from '@datalib/panels/deletePanel';

async function initializeEmptyPanels() {
  const panelData: Panel[] = Object.values(optedHDTracks).map((track) => ({
    track: track.name,
    domain: track.domain ?? '',
    user_ids: [],
  }));
  const response = await CreateManyPanels(panelData);
  return JSON.parse(JSON.stringify(response));
}

export default async function assignJudgesToPanels(panelSize: number = 5) {
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
      error: `Failed to get panels: ${panelsRes.error ?? 'No panels found'}`,
    };
  }

  // only judges who have checked in and explicitly opted into panels
  const judgesRes = await GetManyUsers({
    role: 'judge',
    has_checked_in: true,
    opted_into_panels: true,
  });
  console.log(judgesRes);
  if (!judgesRes.ok || judgesRes.body.length === 0) {
    return {
      ok: false,
      body: null,
      error: `Failed to get judges: ${judgesRes.error ?? 'No judges found'}`,
    };
  }

  const response = await judgeToPanelAlgorithm(
    panelsRes.body,
    judgesRes.body,
    panelSize
  );
  if (!response) {
    console.log(response);
    const deleteRes = await DeleteManyPanels();
    console.log(deleteRes);
    return {
      ok: false,
      body: response,
      error:
        `Not enough judges for panels of size ${panelSize}, reduce panelSize.` +
        (deleteRes.ok
          ? ''
          : 'Failed to clear collection, delete all panels before retrying'),
    };
  }

  const panelUpdates = response.map(async (panel: Panel) => {
    if (!panel._id)
      return {
        ok: false,
        body: null,
        error: 'Panel ID not found during update',
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
