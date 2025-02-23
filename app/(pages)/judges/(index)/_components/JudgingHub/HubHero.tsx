import Image from 'next/image';
import judgeHeroes from '/public/judges/hub/judgingheroes.svg';

export default function HubHero() {
  return (
    <div className="w-full overflow-hidden bg-[#f2f2f7] flex flex-col justify-center gap-4 relative">
      <div className="px-[5%] pt-[50px] pb-0 flex flex-col gap-2 z-[1]">
        <div className="w-full flex flex-col text-start">
          <h1 className="font-bold">Welcome!</h1>
          <p className="text-[1.5rem]">
            We appreciate you for helping us judge one of California's biggest
            hackathons!
          </p>
        </div>
      </div>
      <div>
        <div className="items-center flex justify-center">
          <Image
            src={judgeHeroes}
            alt="Judging Animals"
            className="right-0 bottom-0"
          />
        </div>
      </div>
    </div>
  );
}
