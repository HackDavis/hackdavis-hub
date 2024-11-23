'use server';
import bcrypt from 'bcryptjs';

import { CreateUser } from '@datalib/users/createUser';
import { DuplicateError, HttpError } from '@utils/response/Errors';
import { GetManyUsers } from '@datalib/users/getUser';
import { CreateAuthToken } from './authToken';
import User from '@typeDefs/user';

export async function Register(body: User) {
  try {
    const { email, password, ...rest } = body;
    const hashedPassword = await bcrypt.hash(password as string, 10);

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

    const token = await CreateAuthToken(data.body);
    return { ok: true, body: token, error: null };
  } catch (e) {
    const error = e as HttpError;
    return { ok: false, error: error.message };
  }
}
