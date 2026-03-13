'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { updateUser } from '@actions/users/updateUser';
import RoleStage from './RoleStage';
import LevelStage from './LevelStage';

type DetailFormProps = {
  id: string;
};

export default function DetailForm({ id }: DetailFormProps) {
  const router = useRouter();

  const [stage, setStage] = useState<0 | 1>(0);
  const [role, setRole] = useState<string>();
  const [level, setLevel] = useState<string>();
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!role || !level) return;

    setLoading(true);
    setError('');

    const is_beginner = level === 'beginner';

    const userRes = await updateUser(id, {
      $set: {
        position: role,
        is_beginner,
      },
    });

    if (userRes.ok) {
      router.push('/');
    } else {
      setError(userRes.error ?? 'Error updating details');
    }

    setLoading(false);
  };

  return (
    <div>
      {stage === 0 ? (
        <RoleStage
          value={role}
          onSelect={setRole}
          onBack={() => router.push('/register')}
          onNext={() => {
            if (!role) return;
            setStage(1);
          }}
        />
      ) : (
        <LevelStage
          value={level}
          onSelect={setLevel}
          onBack={() => setStage(0)}
          onNext={handleRegister}
          loading={loading}
          error={error}
        />
      )}
    </div>
  );
}
