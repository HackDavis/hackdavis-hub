'use client';

import { useTimeTrigger } from '@pages/_hooks/useTimeTrigger';

interface TimeTriggerEntityProps {
  triggerTime: number;
  callback: any;
}
export default function TimeTriggerEntity({
  triggerTime,
  callback,
}: TimeTriggerEntityProps) {
  useTimeTrigger(triggerTime, callback);
  return null;
}
