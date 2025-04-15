import { redirect } from "next/navigation";

import { auth } from "@/auth";
import InviteOnlyRoute from "@components/InviteOnlyRoute/InviteOnlyRoute";
import RegisterForm from "../_components/AuthForms/RegisterForm";
import { getInviteData } from "@actions/invite/getInviteData";
import AuthFormBackground from "../_components/AuthFormBackground/AuthFormBackground";

export default async function RegisterPage() {
  const session = await auth();
  if (session) redirect("/judges");

  const data = await getInviteData();

  if (data?.role === "hacker") {
    redirect("/register");
  }

  return (
    <InviteOnlyRoute>
      <AuthFormBackground
        title="Welcome Judges!"
        subtitle="Please create an account with us."
      >
        <RegisterForm data={data} />
      </AuthFormBackground>
    </InviteOnlyRoute>
  );
}
