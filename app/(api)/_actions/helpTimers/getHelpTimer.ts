'use server';
import { GetHelpTimers, GetNextTimer } from '@datalib/helpTimers/getHelpTimer';

export async function getHelperTimers(query: object = {}) {
  const timers = await GetHelpTimers(query);
  return timers;
}

export async function getNextTimer() {
  const timer = await GetNextTimer();
  return timer;
}
