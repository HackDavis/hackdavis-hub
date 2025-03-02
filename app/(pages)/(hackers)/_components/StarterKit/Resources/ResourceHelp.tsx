import Image from 'next/image';
import Froggy_Image from 'public/starter_kit_resources/Froggy.svg';
import Cow_Tada from 'public/starter_kit_resources/Cow_tada.svg';
import Star from 'public/starter_kit_resources/Star.svg';
export default function ResourceHelp() {
  return (
    <main className="relative h-[560px] flex flex-col items-center  bg-[#005271] p-12 rounded-xl pt-24">
      <div className="flex flex-col items-center justify-center text-white font-jakarta">
        <p className="text-lg tracking-[0.02em] leading-[145%]">
          FEEL FREE TO REFER TO THIS ANYTIME THROUGHOUT THE HACKATHON.
        </p>
        <h3 className="text-[32px] font-semibold tracking-[0.02em] leading-[40px]">
          We're here to help you succeed!
        </h3>
      </div>
      <div className="absolute bottom-0 flex gap-4 items-end">
        <Image src={Cow_Tada} alt="Cow Tada" width={280} height={320} />
        <Image src={Froggy_Image} alt="Froggy" width={270} height={330} />
      </div>
      <div className="absolute bottom-64 left-12">
        <Image src={Star} alt="Star" width={45} height={46} />
      </div>
      <div className="absolute bottom-72 right-12">
        <Image src={Star} alt="Star" width={45} height={45} />
      </div>
      <div className="absolute bottom-48 left-24">
        <Image src={Star} alt="Star" width={90} height={90} />
      </div>
      <div className="absolute bottom-24 right-28">
        <Image src={Star} alt="Star" width={65} height={65} />
      </div>
    </main>
  );
}
