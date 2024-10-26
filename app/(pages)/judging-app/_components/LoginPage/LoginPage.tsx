import ProtectedDisplay from '@components/ProtectedDisplay/ProtectedDisplay';
import JudgingHub from '../JudgingHub/JudgingHub';

export default function LoginPage() {
  return (
    <ProtectedDisplay
      loadingDisplay={<div>Loading...</div>}
      failDisplay={<div>Please log in to access the Judging App</div>}
    >
      <JudgingHub />
    </ProtectedDisplay>
  );
}
