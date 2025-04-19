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
  const { ok, loading, available, rollout, error, fetchAvailability } =
    useFeatureAvailability(featureId);
  if (loading) {
    return 'loading...';
  }

  if (!ok) {
    return JSON.stringify(error);
  }

  if (!available) {
    return (
      <>
        {fallback}
        <TimeTriggerEntity
          triggerTime={rollout.rollout_time}
          callback={() => {
            callback?.();
            fetchAvailability(featureId);
          }}
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
          callback={() => {
            callback?.();
            fetchAvailability(featureId);
          }}
        />
      )}
    </>
  );
}
