import { getDatabase } from '@utils/mongodb/mongoClient.mjs';
import { HttpError } from '@utils/response/Errors';

export const GetNextTimer = async () => {
  try {
    const db = await getDatabase();
    const timers = await db.collection('helpTimers').find({}).toArray();
    const timers_converted = timers.map(
      (time: { _id: string; time: string }) => {
        return {
          _id: time._id,
          time: time.time,
          utc: Date.parse(time.time.concat(':00-07:00')),
        };
      }
    );

    const timers_sorted = timers_converted.sort(
      (a: { utc: number }, b: { utc: number }) => a.utc - b.utc
    );

    let out_index = -1;
    const curr_time = Date.now();
    for (let i = 0; i < timers_sorted.length; i++) {
      if (curr_time - timers_sorted[i].utc < 0) {
        out_index = i;
        break;
      }
    }

    if (out_index === -1) {
      throw new HttpError('No upcoming event');
    }

    return { ok: true, body: timers_sorted[out_index], error: null };
  } catch (e) {
    const error = e as HttpError;
    return { ok: false, body: null, error: error.message };
  }
};

export const GetHelpTimers = async (query: object = {}) => {
  try {
    const db = await getDatabase();

    const timers = await db.collection('helpTimers').find(query).toArray();

    return { ok: true, body: timers, error: null };
  } catch (e) {
    const error = e as HttpError;
    return { ok: false, body: null, error: error.message };
  }
};
