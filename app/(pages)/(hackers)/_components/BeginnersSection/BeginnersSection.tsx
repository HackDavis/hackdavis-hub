import Image from 'next/image';
import grass_top from 'public/hackers/mvp/beginners/grass_top.svg';
import mascots from 'public/hackers/mvp/beginners/mascots.svg';
import TextCard from './TextCard';

export default function BeginnersSection() {
  return (
    <div className="bg-[#F1FFCC]">
      <Image src={grass_top} alt="grass detail lining top of section" />
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-[5%] py-[10%] gap-12 md:gap-0">
        <div className="flex-1">
          <Image
            src={mascots}
            width={424}
            height={611}
            alt="four hackdavis mascots looking at a computer"
          />
        </div>
        <div className="flex flex-1 justify-end">
          <TextCard
            short_text="CHECK IT OUT"
            title="For Beginners"
            long_text="We’ve created a Starter kit for all beginner hackers to get their hack started! Inside includes: resources, past winning hacks, and more."
            button_text="STARTER KIT"
            button_link="/starter-kit"
            button_color="AFD157"
            text_color="1A3819"
          />
        </div>
      </div>
    </div>
  );
}
