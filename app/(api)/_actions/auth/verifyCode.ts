'use server';

import { updateUser } from '@actions/users/updateUser';

export default async function verifyCode(id: string, code: string) {
  try {
    const validCode = code === (process.env.CHECK_IN_CODE as string);
    if (!validCode) {
      throw new Error('Invalid code.');
    }

    const res = await updateUser(id, {
      $set: {
        has_checked_in: true,
      },
    });

    if (!res.ok) {
      throw new Error('Failed to check in user.');
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
