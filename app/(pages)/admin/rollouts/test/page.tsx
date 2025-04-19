// import TimeProtectedDisplay from '@pages/_components/TimeProtectedDisplay/TimeProtectedDisplay';
import ClientTimeProtectedDisplay from '@pages/_components/TimeProtectedDisplay/ClientTimeProtectedDisplay';

export default function Test() {
  return (
    <ClientTimeProtectedDisplay featureId="test" fallback={'not ready'}>
      hi
    </ClientTimeProtectedDisplay>
  );
}
