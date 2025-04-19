// don't want caching on this server component, but want the security of having code run on server
export const dynamic = 'force-dynamic';

import checkFeatureAvailability from '@actions/rollouts/checkFeatureAvailability';
import TimeTriggerEntity from './TimeTriggerEntity';
import revalidateAll from '@actions/revalidate/revalidateAll';
import Rollout from '@typeDefs/rollout';

export default async function TimeProtectedDisplay({
  featureId,
  fallback = null,
  children,
}: {
  featureId: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { ok, body, error } = await checkFeatureAvailability(featureId);
  if (!ok) {
    return JSON.stringify(error);
  }

  const { available, rollout } = body as {
    available: boolean;
    rollout: Rollout;
  };

  if (!available) {
    return (
      <>
        {fallback}
        <TimeTriggerEntity
          triggerTime={rollout.rollout_time}
          callback={revalidateAll}
        />
      </>
    );
  }

  return (
    <>
      {children}
      {rollout.rollback_time && (
        <TimeTriggerEntity
          triggerTime={rollout.rollback_time}
          callback={revalidateAll}
        />
      )}
    </>
  );
}
