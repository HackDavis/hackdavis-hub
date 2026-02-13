'use client';

import TimeTriggerEntity from './TimeTriggerEntity';
import { useFeatureAvailability } from '@pages/_hooks/useFeatureAvailability';

export default function ClientTimeProtectedDisplay({
  featureId,
  fallback = null,
  children,
}: {
  featureId: string;
  fallback?: React.ReactNode;
  callback?: () => void;
  children: React.ReactNode;
}) {
  const { loading, available, rollout, fetchAvailability } =
    useFeatureAvailability(featureId);

  if (loading && !rollout) {
    return 'Loading...';
  }

  if (!available) {
    return (
      <>
        {fallback}
        <TimeTriggerEntity
          triggerTime={rollout.rollout_time}
          callback={() => fetchAvailability(featureId)}
        />
      </>
    );
  }

  return <>{children}</>;
}
