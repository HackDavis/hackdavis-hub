'use server';

import { hash } from 'bcryptjs';
import { signIn } from 'auth';

import { CreateUser } from '@datalib/users/createUser';
import {
  DuplicateError,
  HttpError,
  NotAuthenticatedError,
} from '@utils/response/Errors';
import { GetManyUsers } from '@datalib/users/getUser';
import User from '@typeDefs/user';

export async function Register(body: User) {
  try {
    const { email, password, ...rest } = body;
    const hashedPassword = await hash(password as string, 10);

    // Find user
    const userData = await GetManyUsers({ email });
    if (!userData.ok || userData.body.length !== 0) {
      throw new DuplicateError('User already exists');
    }

    // Create user
    const data = await CreateUser({
      email,
      password: hashedPassword,
      ...rest,
    });

    if (!data.ok) {
      throw new HttpError('Failed to create user');
    }

    // Sign In
    const response = await signIn('credentials', {
      email: email,
      password: password,
      redirect: false,
    });

    if (!response?.ok) {
      throw new NotAuthenticatedError('Invalid login credentials');
    }

    return { ok: true, body: response, error: null, status: 200 };
  } catch (e) {
    const error = e as HttpError;
    return {
      ok: false,
      body: null,
      error: error.message,
      status: error.status,
    };
  }
}
