'use client';

import Image from "next/image";
import type { StaticImageData } from "next/image"; // why statuc image data?
// Icons
import writing_sign from "@public/hackers/starter-kit/ideate/tabler_writing-sign.svg";
import presentation_analytics from "@public/hackers/starter-kit/ideate/tabler_presentation-analytics.svg";
import sparkles from "@public/hackers/starter-kit/ideate/tabler_sparkles-2.svg";
import figma from "@public/hackers/starter-kit/ideate/tabler_brand-figma.svg";
 
import github from "@public/hackers/starter-kit/ideate/tabler_brand-github.svg";
import desktop_code from "@public/hackers/starter-kit/ideate/tabler_device-desktop-code.svg";
import message_chatbot from "@public/hackers/starter-kit/ideate/tabler_message-chatbot.svg";

import text_size from "@public/hackers/starter-kit/ideate/tabler_text-size.svg";
import image_in_picture from "@public/hackers/starter-kit/ideate/tabler_image-in-picture.svg";
import shape from "@public/hackers/starter-kit/ideate/tabler_shape.svg";

import arrow from "@public/hackers/starter-kit/ideate/arrow_icon.svg";

// Big Images
import designer_responsibilities_image from "@public/hackers/starter-kit/ideate/designer_responsibilities.svg";
import developer_responsibilities_image from "@public/hackers/starter-kit/ideate/developer_responsibilities.svg";
import designer_tips1_image from "@public/hackers/starter-kit/ideate/designer_tips1.svg";
import designer_tips2_image from "@public/hackers/starter-kit/ideate/designer_tips2.svg";

import figma_beginners_image from "@public/hackers/starter-kit/ideate/figma_beginners.svg";
import figma_shapes from "@public/hackers/starter-kit/ideate/figma_shapes.svg";
import mongodb from "@public/hackers/starter-kit/ideate/mongodb.svg";
import auth0 from "@public/hackers/starter-kit/ideate/auth0.svg";

import timeline from "@public/hackers/starter-kit/ideate/timeline.svg";

// Extra
import scroll_bar1 from "@public/hackers/starter-kit/ideate/scroll_bar1.svg";
import divider from "@public/hackers/starter-kit/ideate/divider.svg";

interface Link {
  type: string;
  title: string;
  description: string;
  image: StaticImageData;
  buttonName: string; 
  link: string;
  alt: string;
}

function Link({link} : {link: Link}) {
  return (
    <div className="flex flex-col md:flex-row bg-white rounded-[16px] gap-[32px] px-[18px] py-[32px]">
      <Image src={link.image} alt={link.alt} className="w-full md:w-auto" />
      <div className="flex flex-col gap-[8px]">
        <p className="opacity-[0.40] text-[16px]">{link.type}</p>
        <p className="text-[20px] text-[#1F1F1F] font-semibold">{link.title}</p>
        <p className="opacity-[0.65] text-[16px]">{link.description}</p>
        <button className="flex flex-row gap-[4px] items-center bg-[#3F3F3F] rounded-full px-[24px] py-[12px] mt-[8px] text-[#FAFAFF] text-[14px] w-min text-nowrap" onClick={() => window.open(link.link, "_blank")}>
          {link.buttonName} 
          <Image src={arrow} alt="arrow" className="w-[20px] h-[20px] shrink-0"/>
        </button> 
      </div>
    </div>
  );
}
export default function Ideate() {
  return <div>Ideate</div>;
}
