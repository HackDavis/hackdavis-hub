"use server";

import Register from "@datalib/auth/register";

export default async function RegisterAction(body: object) {
  return Register(body);
}
