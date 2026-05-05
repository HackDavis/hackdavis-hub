'use server';

import { GetEvents } from '@datalib/events/getEvent';

let cachedTeamMixer: any = null;

export async function getTeamMixerEvent() {
  if (cachedTeamMixer) return cachedTeamMixer;

  const res = await GetEvents({ name: 'Team Mixer' });
  if (res.ok) {
    cachedTeamMixer = res.body?.[0];
  }
  return cachedTeamMixer || null;
}
