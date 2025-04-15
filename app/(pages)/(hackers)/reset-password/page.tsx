import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getInviteData } from "@actions/invite/getInviteData";
import InviteOnlyRoute from "@components/InviteOnlyRoute/InviteOnlyRoute";
import ResetPasswordForm from "../_components/AuthForms/ResetPasswordForm";
import AuthFormBackground from "../_components/AuthFormBackground/AuthFormBackground";

export default async function RegisterPage() {
  const session = await auth();
  if (session) {
    redirect("/");
  }

  const data = await getInviteData();

  if (data?.role === "judge") {
    redirect("/judges/reset-password");
  }

  return (
    <InviteOnlyRoute>
      <AuthFormBackground
        title="Hi Hacker!"
        subtitle="Please enter your new password below."
      >
        <ResetPasswordForm data={data} />
      </AuthFormBackground>
    </InviteOnlyRoute>
  );
}
