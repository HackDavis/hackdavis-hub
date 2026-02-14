'use client';

import TimeTriggerEntity from './TimeTriggerEntity';
import { useFeatureAvailability } from '@pages/_hooks/useFeatureAvailability';

export default function ClientTimeProtectedDisplay({
  featureId,
  fallback = null,
  callback = () => {},
  children,
}: {
  featureId: string;
  fallback?: React.ReactNode;
  callback?: () => void;
  children: React.ReactNode;
}) {
  const { loading, available, rollout, error, fetchAvailability } =
    useFeatureAvailability(featureId);

  // initial loading state
  if (loading && !rollout) {
    return 'Loading...';
  }

  // error or no rollout info, then don't render 24 hr timer
  if (error || !rollout) {
    return <>{fallback}</>;
  }

  const handleTrigger = async () => {
    await fetchAvailability(featureId, true);
    callback?.();
  };

  if (!available) {
    return (
      <>
        {fallback}
        <TimeTriggerEntity
          triggerTime={rollout.rollout_time}
          callback={handleTrigger}
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
          callback={handleTrigger}
        />
      )}
    </>
  );
}
