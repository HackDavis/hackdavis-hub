'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { GetManyUsers } from '@datalib/users/getUser';
import InviteData from '@typeDefs/inviteData';

export async function getInviteData() {
  const users = await GetManyUsers();
  const noUsers = users.body.length === 0;

  if (noUsers) {
    return null;
  } else {
    const data = cookies().get('data');
    if (data === undefined) redirect('/');

    return JSON.parse(atob(data.value)) as InviteData;
  }
}
