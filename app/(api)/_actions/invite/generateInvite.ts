'use server';

import GenerateInvite from '@datalib/invite/generateInvite';
import InviteData from '@typeDefs/inviteData';

export async function generateInvite(data: InviteData) {
  const res = await GenerateInvite(data);
  return res;
}
