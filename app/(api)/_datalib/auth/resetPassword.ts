'use server';
import bcrypt from 'bcryptjs';

import { GetManyUsers } from '@datalib/users/getUser';
import { UpdateUser } from '@datalib/users/updateUser';
import { HttpError } from '@utils/response/Errors';
import { signOut } from 'auth';

export async function ResetPassword(body: { email: string; password: string }) {
  try {
    const { email, password } = body;
    const hashedPassword = await bcrypt.hash(password as string, 10);

    // Find user
    const user_data = await GetManyUsers({ email });
    if (!user_data.ok || user_data.body.length === 0) {
      throw new HttpError('user not found');
    }

    // UpdateUser
    const updateData = await UpdateUser(user_data.body[0]._id, {
      $set: {
        password: hashedPassword,
      },
    });

    await signOut();

    return { ok: true, body: updateData, error: null, status: 200 };
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
