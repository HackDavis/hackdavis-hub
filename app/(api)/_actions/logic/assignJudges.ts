'use server';

import { GetManyPanels } from '@datalib/panels/getPanels';
import { GetManyUsers } from '@datalib/users/getUser';
import { AssignJudgesToPanels } from '@utils/matching/judgeToPanelAlgorithm';
import { categorizedTracks } from '@data/tracks';
import { CreateManyPanels } from '@datalib/panels/createPanels';
import Panel from '@typeDefs/panel';

export async function initializeEmptyPanels() {
  const panelData: Panel[] = Object.values(categorizedTracks).map((track) => ({
    track: track.name,
    domain: track.domain ?? '',
    user_ids: [],
  }));
  const response = await CreateManyPanels(panelData);
  return response;
}

export async function assignJudgesToPanels() {
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

  const response = await AssignJudgesToPanels(panelsRes.body, judgesRes.body);
  return response;
}
