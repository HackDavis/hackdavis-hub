import Login from '@datalib/auth/login';
import { CreateUser } from '@datalib/users/createUser';
import HttpError from '@utils/response/HttpError';

export default async function Register(body: any) {
  try {
    const password = body.password;
    const userRes = await CreateUser(body);

    if (!userRes.ok) {
      throw new HttpError(userRes.error ?? 'Error creating user');
    }

    const response = await Login(body.email, password);

    if (!response.ok) {
      throw new HttpError(userRes.error ?? 'Authentication error');
    }

    return { ok: true, body: userRes.body, error: null };
  } catch (e) {
    const error = e as HttpError;
    return {
      ok: false,
      body: null,
      error: error.message,
    };
  }
}
