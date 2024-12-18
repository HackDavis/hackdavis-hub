'use server';

import { CreateUser } from '@datalib/users/createUser';

export async function createUser(
  name: string,
  email: string,
  password: string,
  specialties: [string],
  role: string
) {
  const response = await CreateUser({
    name,
    email,
    password,
    specialties,
    role,
  });
  return response;
}
