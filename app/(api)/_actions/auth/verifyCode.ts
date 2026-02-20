'use server';

import { updateUser } from '@actions/users/updateUser';

export default async function verifyCode(
  id: string,
  code: string,
  optedIntoPanels?: boolean
) {
  try {
    const validCode = code === (process.env.CHECK_IN_CODE as string);
    if (!validCode) {
      throw new Error('Invalid code.');
    }

    const update: any = { has_checked_in: true };
    if (typeof optedIntoPanels === 'boolean') {
      update.opted_into_panels = optedIntoPanels;
    }

    const res = await updateUser(id, {
      $set: update,
    });

    if (!res.ok) {
      throw new Error(res.error ?? 'Failed to check in user.');
    }

    return {
      ok: true,
      body: res.body,
      error: null,
    };
  } catch (e) {
    const error = e as Error;
    return {
      ok: false,
      body: null,
      error: error.message,
    };
  }
}
