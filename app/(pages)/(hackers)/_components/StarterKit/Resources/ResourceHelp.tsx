import Image from 'next/image';
import Froggy_Image from 'public/starterKit/Froggy.svg';
import Cow_Tada from 'public/starterKit/Cow_tada.svg';
import Star from 'public/starterKit/star.svg';
export default function ResourceHelp() {
  return (
    <main className="relative flex flex-col items-center rounded-xl bg-[--background-secondary] px-6 pt-10 xs:px-10 xs:pt-14 sm:px-12 md:pt-16 overflow-y-clip">
      <div className="relative flex flex-col items-center justify-center text-white font-jakarta text-center">
        <p className="text-[10px] xs:text-xs sm:text-sm lg:text-lg tracking-[0.02em] leading-[145%] text-balance">
          FEEL FREE TO REFER TO THIS ANYTIME THROUGHOUT THE HACKATHON.
        </p>
        <h3 className="text-sm xs:text-base sm:text-lg lg:text-4xl mt-2 xs:mt-4 md:mt-0 font-semibold tracking-[0.02em] md:leading-[40px]">
          We're here to help you succeed!
        </h3>
        <div className="absolute -right-2 -top-6 2xs:-right-4 sm:-right-8 md:hidden">
          <Image
            src={Star}
            alt="Star"
            className="aspect-square w-[19px] sm:w-[30px] lg:w-[45px]"
          />
        </div>
        <div className="absolute -left-2 top-4 xs:-left-0 xs:top-6 sm:-left-6 md:hidden">
          <Image
            src={Star}
            alt="Star"
            className="aspect-square w-[19px] sm:w-[30px] lg:w-[45px]"
          />
        </div>
      </div>
      <div className="relative -bottom-2 w-full flex items-end mt-5 md:gap-4 md:mt-10 lg:mt-12 xl:mt-20 md:w-3/5 lg:w-auto lg:m-auto">
        <Image
          src={Cow_Tada}
          alt="Cow Tada"
          className="aspect-[280/320] w-7/12 lg:h-[260px] lg:w-auto xl:h-[350px]"
        />
        <Image
          src={Froggy_Image}
          alt="Froggy"
          className="aspect-[270/330] w-6/12 lg:h-[240px] lg:w-auto xl:h-[330px]"
        />

        <div className="absolute hidden md:block bottom-52 -left-28 lg:bottom-64 lg:-left-36 xl:bottom-80">
          <Image
            src={Star}
            alt="Star"
            className="aspect-square w-[30px] lg:w-[45px]"
          />
        </div>
        <div className="absolute bottom-32 -left-24 hidden md:block lg:bottom-32 lg:-left-28 xl:bottom-52">
          <Image
            src={Star}
            alt="Star"
            className="aspect-square w-[75px] lg:w-[90px]"
          />
        </div>
        <div className="absolute hidden md:block md:bottom-48 md:-right-28 lg:bottom-56 lg:-right-40 xl:bottom-72">
          <Image
            src={Star}
            alt="Star"
            className="aspect-square w-[30px] lg:w-[45px]"
          />
        </div>
        <div className="absolute bottom-24 -right-16 hidden md:block lg:bottom-24 lg:-right-24  xl:bottom-36">
          <Image
            src={Star}
            alt="Star"
            className="aspect-square w-[60px] lg:w-[65px]"
          />
        </div>
      </div>
    </main>
  );
}
