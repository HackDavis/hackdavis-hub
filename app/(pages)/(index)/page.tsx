import HackerHub from './_components/HackerHub/HackerHub';
import ProtectedDisplay from '@components/ProtectedDisplay/ProtectedDisplay';

export default function Page() {
  return (
    <ProtectedDisplay
      loadingDisplay={<div>Loading...</div>}
      failDisplay={<div>Please log in to access HackerHub</div>}
    >
      <HackerHub />
    </ProtectedDisplay>
  );
}
