import { z } from 'zod';

import Login from '@datalib/auth/login';
import { CreateUser } from '@datalib/users/createUser';
import HttpError from '@utils/response/HttpError';

const emailSchema = z.string().email('Invalid email address.');

const passwordSchema = z
  .string()
  .min(6, { message: 'Password must be at least 6 characters long.' })
  .max(20, { message: 'Password cannot be longer than 20 characters.' });

export default async function Register(body: any) {
  try {
    emailSchema.parse(body.email);
    passwordSchema.parse(body.password);
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
    if (e instanceof z.ZodError) {
      const errorMessage = e.errors.map((error) => error.message).join(' ');
      return {
        ok: false,
        body: null,
        error: errorMessage,
      };
    }

    const error = e as HttpError;
    return {
      ok: false,
      body: null,
      error: error.message,
    };
  }
}
