import { redirect } from 'next/navigation';
import getActiveUser from 'app/(pages)/_utils/getActiveUser';

export default async function CodeProtectedDisplay({
  failRedirectRoute,
  children,
}: {
  failRedirectRoute: string;
  children: React.ReactNode;
}) {
  const user = await getActiveUser(failRedirectRoute);

  if (user.has_checked_in) {
    return <>{children}</>;
  } else {
    redirect(failRedirectRoute);
  }
}
