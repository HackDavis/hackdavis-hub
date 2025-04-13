'use server';
import bcrypt from 'bcryptjs';

import { GetManyUsers } from '@datalib/users/getUser';
import { UpdateUser } from '@datalib/users/updateUser';
import { HttpError } from '@utils/response/Errors';

export async function ResetPassword(body: { email: string; password: string }) {
  try {
    const { email, password } = body;
    const hashedPassword = await bcrypt.hash(password as string, 10);

    const user_data = await GetManyUsers({ email });
    if (!user_data.ok || user_data.body.length === 0) {
      throw new HttpError('user not found');
    }

    const updateData = await UpdateUser(user_data.body[0]._id, {
      $set: {
        password: hashedPassword,
      },
    });

    return { ok: true, body: updateData.body, error: null };
  } catch (e) {
    const error = e as HttpError;
    return {
      ok: false,
      body: null,
      error: error.message,
    };
  }
}
