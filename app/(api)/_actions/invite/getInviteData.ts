"use server";

import { cookies } from "next/headers";

import { GetManyUsers } from "@datalib/users/getUser";
import InviteData from "@typeDefs/inviteData";

export async function getInviteData() {
  const users = await GetManyUsers();
  const noUsers = users.body.length === 0;

  if (noUsers) {
    return null;
  } else {
    const data = cookies().get("data");
    if (!data) return null;

    const dataJson = atob(data.value);
    return JSON.parse(dataJson) as InviteData;
  }
}
