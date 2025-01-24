import Login from '@datalib/auth/login';
import { CreateUser } from '@datalib/users/createUser';
import HttpError from '@utils/response/HttpError';

<<<<<<< HEAD
import { CreateJudge } from '@datalib/judges/createJudge';
import { DuplicateError, HttpError } from '@utils/response/Errors';
import { GetManyJudges } from '@datalib/judges/getJudge';
import { createAuthToken } from './authToken';
import User from '@typeDefs/user';

export async function Register(body: User) {
=======
export default async function Register(body: any) {
>>>>>>> 95b4e4b5adb199a409d29786cc4d53cbe5e0ba0c
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
