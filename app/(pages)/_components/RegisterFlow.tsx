'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import PasswordStage from './register-flow/stages/PasswordStage';
import RoleStage from './register-flow/stages/RoleStage';
import LevelStage from './register-flow/stages/LevelStage';

import AuthFormBackground from '@pages/(hackers)/_components/AuthFormBackground/AuthFormBackground';

type RegisterFlowProps = {
  data?: any;
};

type OnboardingFormData = {
  role?: string;
  level?: string;
};

export default function RegisterFlow({ data }: RegisterFlowProps) {
  const router = useRouter();

  const [stage, setStage] = useState<0 | 1 | 2>(0);
  const [formData, setFormData] = useState<OnboardingFormData>({});

  const goNext = () => setStage((s) => (s === 2 ? s : ((s + 1) as 0 | 1 | 2)));

  const goBack = () => setStage((s) => (s === 0 ? s : ((s - 1) as 0 | 1 | 2)));

  return (
    <AuthFormBackground title="" subtitle="" showAngelCow={stage === 0}>
      <div className="w-full">
        <div className="relative overflow-hidden">
          <div
            className="flex w-full transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${stage * 100}%)` }}
          >
            {/* PASSWORD */}
            <div className="w-full shrink-0">
              <PasswordStage data={data} onNext={() => setStage(1)} />
            </div>

            {/* ROLE */}
            <div className="w-full shrink-0">
              <RoleStage
                value={formData.role}
                onSelect={(value) =>
                  setFormData((prev) => ({ ...prev, role: value }))
                }
                onBack={goBack}
                onNext={goNext}
              />
            </div>

            {/* LEVEL */}
            <div className="w-full shrink-0">
              <LevelStage
                value={formData.level}
                onSelect={(value) =>
                  setFormData((prev) => ({ ...prev, level: value }))
                }
                onBack={goBack}
                onNext={() => router.push('/register/details')}
              />
            </div>
          </div>
        </div>
      </div>
    </AuthFormBackground>
  );
}
