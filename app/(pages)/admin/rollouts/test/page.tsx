import TimeProtectedDisplay from '@pages/_components/TimeProtectedDisplay/TimeProtectedDisplay';

export default function Test() {
  return (
    <TimeProtectedDisplay featureId="test" fallback={'not ready'}>
      hi
    </TimeProtectedDisplay>
  );
}
