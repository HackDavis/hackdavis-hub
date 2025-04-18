import { redirect } from 'next/navigation';
import checkFeatureAvailability from '@actions/rollouts/checkFeatureAvailability';
import getActiveUser from 'app/(pages)/_utils/getActiveUser';

export default async function CodeProtectedDisplay({
  failRedirectRoute,
  featureId,
  children,
}: {
  failRedirectRoute: string;
  featureId: string;
  children: React.ReactNode;
}) {
  const res = await checkFeatureAvailability(featureId);
  if (!res.ok) return <>{children}</>;

  const user = await getActiveUser(failRedirectRoute);
  if (user.has_checked_in) {
    return <>{children}</>;
  } else {
    redirect(failRedirectRoute);
  }
}
