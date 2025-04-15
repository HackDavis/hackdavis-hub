import { redirect } from "next/navigation";

import getActiveUser from "app/(pages)/_utils/getActiveUser";

export default async function ProtectedDisplay({
  allowedRoles,
  failRedirectRoute,
  children,
}: {
  allowedRoles: string[];
  failRedirectRoute: string;
  children: React.ReactNode;
}) {
  const user = await getActiveUser(failRedirectRoute);

  const authorized = allowedRoles.includes(user.role);

  if (user.role === "hacker") {
    if (user.position === undefined || user.is_beginner === undefined) {
      redirect("/register/details");
    } else if (authorized) {
      return <>{children}</>;
    } else {
      redirect("/");
    }
  } else if (user.role === "judge") {
    if (user.specialties === undefined) {
      redirect("/judges/register/details");
    } else if (authorized) {
      return <>{children}</>;
    } else {
      redirect("/judges");
    }
  } else {
    return <>{children}</>;
  }
}
