<<<<<<< HEAD:app/(pages)/judging-app/_components/JudgingHub/HubHero.tsx
import User from '@typeDefs/user';
import Image from 'next/image';
import judgeHeroes from '/public/judges/hub/judgingheroes.svg';

export default function HubHero({
  loading,
}: {
  user: User;
  loading: boolean;
  members: string[];
}) {
  if (loading) {
    return 'loading...';
  }

=======
import Image from 'next/image';
import judgeHeroes from '/public/judges/hub/judgingheroes.svg';

export default function HubHero() {
>>>>>>> 95b4e4b5adb199a409d29786cc4d53cbe5e0ba0c:app/(pages)/judges/(index)/_components/JudgingHub/HubHero.tsx
  return (
    <div className="tw-w-full tw-overflow-hidden tw-bg-[#f2f2f7] tw-flex tw-flex-col tw-justify-center tw-gap-4 tw-relative">
      <div className="tw-px-[5%] tw-pt-[50px] tw-pb-0 tw-flex tw-flex-col tw-gap-2 tw-z-[1]">
        <div className="tw-w-full tw-flex tw-flex-col tw-text-start">
          <h1 className="tw-font-bold">Welcome!</h1>
          <p className="tw-text-[1.5rem]">
            We appreciate you for helping us judge one of California's biggest
            hackathons!
          </p>
        </div>
      </div>
      <div>
        <div className="tw-items-center tw-flex tw-justify-center">
          <Image
            src={judgeHeroes}
            alt="Judging Animals"
            className="tw-right-0 tw-bottom-0"
          />
        </div>
      </div>
    </div>
  );
}
