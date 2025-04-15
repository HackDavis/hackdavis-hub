"use server";

import {
  DeleteManyUserToEvents,
  DeleteUserToEvent,
} from "@datalib/userToEvents/deleteUserToEvent";
import { prepareIdsInQuery } from "@utils/request/parseAndReplace";

export async function deleteUserToEvent(query: {
  user_id: string;
  event_id: string;
}) {
  const result = await DeleteUserToEvent(await prepareIdsInQuery(query));
  return result;
}

export default async function deleteManyUserToEvents(query: object = {}) {
  const result = await DeleteManyUserToEvents(await prepareIdsInQuery(query));
  return result;
}
