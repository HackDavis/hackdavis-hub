'use client';

import RegisterForm from '@pages/(hackers)/_components/AuthForms/RegisterForm';

type PasswordStageProps = {
  data?: any;
  onNext: () => void;
};

export default function PasswordStage({ data, onNext }: PasswordStageProps) {
  return (
    <>
      <div className="flex flex-col items-start w-full">
        <h1 className="text-[20px] md:text-[22px] font-semibold text-[#3F3F3F]">
          Hi {data?.name ?? 'HackDavis Admin'}!
        </h1>
        <p
          className="text-[14px] md:text-[16px] text-[#5E5E65]"
          style={{ whiteSpace: 'pre-line' }}
        >
          Welcome to the HackerHub! The HackDavis team made this for all your hacking needs
          {' <3'}
          {'\n'}Let&apos;s get you started.
        </p>
        </div>
      <RegisterForm data={data} onSuccess={onNext} />
    </>
  );
}

