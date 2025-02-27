'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { GetManyUsers } from '@datalib/users/getUser';

export async function getInviteData() {
  const users = await GetManyUsers();
  const noUsers = users.body.length === 0;

  if (noUsers) {
    return null;
  } else {
    const cookie = cookies().get('data');
    if (cookie === undefined) redirect('/');

    return JSON.parse(atob(cookie.value));
  }
}
