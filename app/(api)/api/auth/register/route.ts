'use server';
import { NextRequest } from 'next/server';
import { HttpError } from '@utils/response/Errors';
import { Register } from '@datalib/auth/register';
import { GetManyUsers } from '@datalib/users/getUser';
import getQueries from '@utils/request/getQueries';
import { verifyHMACSignature } from '@utils/invite/hmac';
import { signIn } from 'auth';

export async function POST(request: NextRequest) {
  try {
    const { data: d, sig: s } = await getQueries(request, 'users');

    const users = await GetManyUsers();

    const verified = verifyHMACSignature(d as string, s as string);
    if (users.body?.length !== 0 && !verified) {
      throw new HttpError('Bad Invite Token');
    }

    // TODO: rework for hacker registration
    const body = await request.json();
    if (d) {
      const dd = atob(d);
      const parsed = JSON.parse(dd);
      body['email'] = parsed?.email ?? body.email;
      body['name'] = parsed?.name ?? body.name;
      body['specialty'] = parsed?.specialty ?? body.specialty;
      body['role'] = parsed?.role ?? body.role;
    }

    const data = await Register(body);

    if (!data.ok || !data.body) {
      throw new HttpError(data.error as string);
    }

    const registeredJudge = data.body;

    const response = await signIn('credentials', {
      email: registeredJudge.email,
      password: registeredJudge.password,
      redirect: false,
    });

    return { ok: true, body: response, error: null, status: 200 };
  } catch (e) {
    const error = e as HttpError;
    return {
      ok: false,
      body: null,
      error: error.message,
      status: error.status || 400,
    };
  }
}
