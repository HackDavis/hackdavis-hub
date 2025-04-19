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
  const { triggered } = useTimeTrigger(triggerTime, callback);
  return `TRIGGERED: ${triggered}`;
}
