"use server";

import GenerateInvite from "@datalib/invite/generateInvite";
import InviteData from "@typeDefs/inviteData";

export async function generateInvite(
  data: InviteData,
  type: string = "invite",
) {
  const res = await GenerateInvite(data, type);
  return res;
}
