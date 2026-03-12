'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import RegisterForm from '@pages/(hackers)/_components/AuthForms/RegisterForm';
import ChooseRole from './slides/ChooseRole';
import ChooseLevel from './slides/ChooseLevel';

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

  return (
    <div className="flex flex-col gap-4">
      {stage === 0 && (
        <>
          <RegisterForm
            data={data}
            onSuccess={() => setStage(1)}
          />

          <button
            type="button"
            className="w-full rounded-lg border border-red-500 bg-red-500 py-3 text-sm font-semibold text-white"
            onClick={() => setStage(1)}
          >
            DEV → Skip Password
          </button>
        </>
      )}

      {stage === 1 && (
        <>
          <ChooseRole
            value={formData.role}
            onSelect={(value) => {
              setFormData((prev) => ({ ...prev, role: value }));
              setStage(2);
            }}
          />

          <button
            type="button"
            className="w-full rounded-lg border border-red-500 bg-red-500 py-3 text-sm font-semibold text-white"
            onClick={() => setStage(2)}
          >
            DEV → Skip Role
          </button>
        </>
      )}

      {stage === 2 && (
        <>
          <ChooseLevel
            value={formData.level}
            onSelect={(value) => {
              setFormData((prev) => ({ ...prev, level: value }));
              router.push('/register/details');
            }}
          />

          <button
            type="button"
            className="w-full rounded-lg border border-red-500 bg-red-500 py-3 text-sm font-semibold text-white"
            onClick={() => router.push('/register/details')}
          >
            DEV → Finish Flow
          </button>
        </>
      )}
    </div>
  );
}