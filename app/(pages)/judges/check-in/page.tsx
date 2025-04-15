import { redirect } from "next/navigation";

import AuthFormBackground from "../_components/AuthFormBackground/AuthFormBackground";
import CheckInForm from "../_components/AuthForms/CheckInForm";
import getActiveUser from "app/(pages)/_utils/getActiveUser";

export default async function CheckInPage() {
  const user = await getActiveUser("/judges/login");

  if (user.role === "hacker") redirect("/");
  if (user.has_checked_in) redirect("/judges");

  return (
    <AuthFormBackground
      title="Welcome Judges!"
      subtitle="Enter the check-in code when you're here at the hackathon so you can start judging!"
    >
      <CheckInForm id={user._id} />
    </AuthFormBackground>
  );
}
