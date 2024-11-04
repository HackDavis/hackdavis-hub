import ProtectedDisplay from '@components/ProtectedDisplay/ProtectedDisplay';
import JudgingHub from '../JudgingHub/JudgingHub';
import LoginForm from './LoginForm';

export default function LoginPage() {
  return (
    <ProtectedDisplay
      loadingDisplay={<div>Loading...</div>}
      failDisplay={<LoginForm />}
    >
      <JudgingHub />
    </ProtectedDisplay>
  );
}
