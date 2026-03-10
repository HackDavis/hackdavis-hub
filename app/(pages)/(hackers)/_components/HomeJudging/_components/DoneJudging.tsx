import Image from 'next/image';
import mascots_celebrate from '@public/hackers/hero/hero-judging/mascots_celebrate.svg';

export default function DoneJudging() {
  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
      <div className="relative flex flex-col bg-white p-[40px] w-full w-[500px] rounded-[20px] gap-[12px]">
        <Image
          src={mascots_celebrate}
          alt="hackdavis mascots celebrating"
          width={420}
          height={287}
        />
        <h2 className="text-[32px]">Congratulations Hacker!</h2>
        <p className="text-[16px] text-[#5E5E65]">
          You’re all done, thank you so much for your participation at HackDavis
          2026. Please wait until <b>Closing Ceremony</b> for judging results!
          In the meantime, put in your vote for{' '}
          <a href="google.com" target="_blank" className="underline font-bold">
            Hacker’s Choice Award
          </a>{' '}
          and check out our insta <b>@hackdavis!</b>
        </p>
      </div>
    </div>
  );
}
