import Image from 'next/image';
import bunny_phone from 'public/hackers/mvp/discord/bunny_phone.svg';
import TextCard from '../BeginnersSection/TextCard';

export default function Discord() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between px-[5%] py-[10%] gap-12 md:gap-0 bg-[#0B2638]">
      <div className="flex-1 flex justify-start">
        <TextCard
          short_text="JOIN US"
          title="Stay Up To Date"
          long_text="Get our live announcement updates in our discord, and connect with other hackers, mentors, and directors!"
          button_text="JOIN DISCORD"
          button_link="https://discord.gg/wc6QQEc"
          button_color="9EE7E5"
          text_color="FFFFFF"
          is_external={true}
        />
      </div>
      <div className="flex-1 flex justify-center md:justify-end">
        <Image
          src={bunny_phone}
          width={424}
          height={611}
          alt="large phone with hackdavis bunny mascot"
          className="w-auto h-auto max-w-full"
        />
      </div>
    </div>
  );
}
