'use server';

import { ObjectId } from 'mongodb';
import { GetUserToEvents } from '@datalib/userToEvents/getUserToEvent';

export async function getUserEvents(userId: string) {
  try {
    const query = {
      user_id: new ObjectId(userId),
    };

    const result = await GetUserToEvents(query);

    return result;
  } catch (error) {
    return {
      ok: false,
      body: null,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to retrieve user events',
    };
  }
}
