import Image from 'next/image';
import mascots from '@public/hackers/starter-kit/introduction/startkit_mascots.svg';

export default function Introduction() {
  return (
    <div className="my-[100px] mx-[60px] gap-[32px] md:gap-[8%] flex flex-col md:flex-row items-center">
      <div className="flex-1">
        <Image src={mascots} alt="hackdavis mascots looking at computer" />
      </div>
      <div className="flex-1">
        <p className="font-dm-mono text-[16px] text-[#A5A5A5]">HACKATHON 101</p>
        <h3 className="font-jakarta text-[28px] md:text-[32px] font-medium">
          Starter Kit
        </h3>
        <p className="font-jakarta text-[16px] text-[#656565]">
          New to hacking? No problem. This kit is your field guide to navigating
          the weekend, finding your team, and shipping your first project.
        </p>
      </div>
    </div>
  );
}
