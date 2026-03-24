import Image from 'next/image';
import mascots_around_couch from '@public/judges/landing/mascots_around_couch.svg';

export default function Questions() {
  return (
    <div className="bg-white rounded-[32px] py-[34px] px-[30px] text-[#3F3F3F]">
      <p className="font-semibold text-[22px]">Question?</p>
      <p className="text-[18px]">
        Please ask a HackDavis director (dark blue shirt)!
      </p>
      <Image
        src={mascots_around_couch}
        alt="mascots around couch"
        className="w-full"
      />
    </div>
  );
}
