import { redirect } from 'next/navigation';

import getActiveUser from 'app/(pages)/_utils/getActiveUser';
import fetchRollout from '@pages/_utils/fetchRolloutTime';
import Rollout from '@typeDefs/rollout';
import RolloutWaiter from '../RolloutWaiter/RolloutWaiter';

export default async function CodeProtectedDisplay({
  failRedirectRoute,
  children,
}: {
  failRedirectRoute: string;
  children: React.ReactNode;
}) {
  const user = await getActiveUser(failRedirectRoute);
  const rollout: Rollout = await fetchRollout('judge-check-in');

  if (user.has_checked_in) return <>{children}</>;
  if (!rollout || (rollout && Date.now() < rollout.rollout_time)) {
    // feature hasnt rolled out yet
    return (
      <RolloutWaiter component_key="judge-check-in">{children}</RolloutWaiter>
    );
  } else {
    redirect(failRedirectRoute);
  }
}
