import { redirect } from "next/navigation";

import { auth } from "@/auth";
import LoginForm from "../_components/AuthForms/LoginForm";
import AuthFormBackground from "app/(pages)/(hackers)/_components/AuthFormBackground/AuthFormBackground";

export default async function LoginPage() {
  const session = await auth();
  if (session) {
    redirect("/");
  }

  return (
    <AuthFormBackground
      title="Hi Hacker!"
      subtitle="Welcome to the HackerHub! The HackDavis team made this for all your hacking needs <3"
    >
      <LoginForm />
    </AuthFormBackground>
  );
}
