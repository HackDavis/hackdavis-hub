import { redirect } from "next/navigation";

import { auth } from "@/auth";
import LoginForm from "../_components/AuthForms/LoginForm";
import AuthFormBackground from "../_components/AuthFormBackground/AuthFormBackground";

export default async function LoginPage() {
  const session = await auth();
  if (session) {
    redirect("/judges");
  }

  return (
    <AuthFormBackground
      title="Welcome Judges!"
      subtitle="Enter your email and password."
    >
      <LoginForm />
    </AuthFormBackground>
  );
}
