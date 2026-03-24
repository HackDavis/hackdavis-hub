'use server';

import Register from '@datalib/auth/register';

export default async function RegisterAction(body: object) {
  try {
    const result = await Register(body);
    if (!result.ok) {
      return result;
    }
    return { ok: true, body: null, error: null };
  } catch (e) {
    const error = e as Error;
    return {
      ok: false,
      body: null,
      error: error.message,
    };
  }
}
