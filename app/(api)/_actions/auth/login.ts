"use server";

import Login from "@datalib/auth/login";

export default async function LoginAction(email: string, password: string) {
  return Login(email, password);
}
