'use server';

import { GetManyPanels } from '@datalib/panels/getPanels';
import { GetManyUsers } from '@datalib/users/getUser';
import judgeToPanelAlgorithm from '@utils/matching/judgeToPanelAlgorithm';
import { categorizedTracks } from '@data/tracks';
import { CreateManyPanels } from '@datalib/panels/createPanels';
import { UpdatePanel } from '@datalib/panels/updatePanel';
import Panel from '@typeDefs/panel';

async function initializeEmptyPanels() {
  const panelData: Panel[] = Object.values(categorizedTracks).map((track) => ({
    track: track.name,
    domain: track.domain ?? '',
    user_ids: [],
  }));
  const response = await CreateManyPanels(panelData);
  return response;
}

export default async function assignJudgesToPanels(maxPanelSize: number = 5) {
  const initRes = await initializeEmptyPanels();
  if (!initRes.ok) {
    initRes.error = `Failed to initialize empty panels: ${initRes.error}`;
    return initRes;
  }

  const panelsRes = await GetManyPanels({});
  if (!panelsRes.ok || panelsRes.body === null) {
    panelsRes.error = `Failed to get panels: ${
      panelsRes.error ?? 'No panels found'
    }`;
    return panelsRes;
  }

  const judgesRes = await GetManyUsers({ role: 'judge' });
  if (!judgesRes.ok || judgesRes.body === null) {
    judgesRes.error = `Failed to get judges: ${
      judgesRes.error ?? 'No judges found'
    }`;
    return judgesRes;
  }

  const response = await judgeToPanelAlgorithm(
    panelsRes.body,
    judgesRes.body,
    maxPanelSize
  );
  if (!response) {
    return {
      ok: false,
      body: response,
      error: `Not enough judges for panels of size ${maxPanelSize}. Reduce maxPanelSize, delete all panels and try again.`,
    };
  }

  console.log(response);

  const panelUpdates = response.map(async (panel: Panel) => {
    const { _id: _, track: __, users: ___, ...rest } = panel;
    return await UpdatePanel(panel.track, { $set: rest });
  });

  const panelUpdateRes = await Promise.all(panelUpdates);
  panelUpdateRes.forEach((res) => {
    console.log(res);
    if (!res.ok) {
      res.error = `Failed to update panel: ${res.error}`;
    }
    return res;
  });

  return JSON.parse(JSON.stringify(await GetManyPanels({})));
}
