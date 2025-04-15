"use server";

import { ResetPassword } from "@datalib/auth/resetPassword";

export default async function ResetPasswordAction(body: {
  email: string;
  password: string;
}) {
  return ResetPassword(body);
}
