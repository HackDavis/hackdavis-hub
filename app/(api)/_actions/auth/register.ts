'use server';

import Register from '@datalib/auth/register';

<<<<<<< HEAD
import type authToken from '@typeDefs/authToken';
import type User from '@typeDefs/user';

export default async function RegisterAction(
  prevState: any,
  formData: FormData
): Promise<{
  ok: boolean;
  body?: authToken | null;
  error?: string | null;
}> {
  try {
    const body = FormToJSON(formData) as User;

    const data = await Register(body);

    if (!data.ok || !data.body) {
      throw new NotAuthenticatedError(data.error as string);
    }

    const payload = jwt.decode(data.body) as authToken;

    cookies().set({
      name: 'auth_token',
      value: data.body,
      expires: payload.exp * 1000,
      secure: true,
      httpOnly: true,
    });

    return { ok: true, body: payload, error: null };
  } catch (e) {
    const error = e as HttpError;
    return { ok: false, body: null, error: error.message };
  }
=======
export default async function RegisterAction(body: object) {
  return Register(body);
>>>>>>> 95b4e4b5adb199a409d29786cc4d53cbe5e0ba0c
}
