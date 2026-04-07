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
function Resources({title, link1, link2} : {title: string, link1: Link, link2: Link}) {
  return (
    <div className="flex flex-col gap-[16px]">
      <p className="text-[20px] text-[#1F1F1F] font-semibold pb-[16px]">{title}</p>
      <Link link={link1} />
      <Link link={link2} />
    </div>
  );
}

interface Responsibility {
  icon: StaticImageData;
  title: string;
  description: string;
}

// shi figure out that bar!!!!!!
function Responsibilities({image, title, responsibilities, reverse} : {image: StaticImageData, title: string, responsibilities: Responsibility[], reverse: boolean}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [responsibilityIndex, setResponsibilityIndex] = useState(0);
  const [scrollPos, setScrollPos] = useState(50);

  /*useEffect(() => {
    const onPageScroll = () => {
      const section = sectionRef.current.scrollTo();
      const scrollContainer = scrollRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const anchorY = window.innerHeight * 0.35;
      const traveled = anchorY - rect.top;
      const rawProgress = traveled / Math.max(rect.height, 1);
      const progress = Math.min(Math.max(rawProgress, 0), 0.999);
      const nextIndex = Math.floor(progress * responsibilities.length);
      const clampedIndex = Math.max(0, Math.min(responsibilities.length - 1, nextIndex));

      setResponsibilityIndex(clampedIndex);

      if (scrollContainer) {
        const maxHeight = scrollContainer.clientHeight;
        const fillProgress = responsibilities.length > 1 ? clampedIndex / (responsibilities.length - 1) : 0;
        setScrollPos(fillProgress * maxHeight);
      }
    };

    onPageScroll();
    window.addEventListener("scroll", onPageScroll, { passive: true });
    //window.addEventListener("resize", onPageScroll);

    return () => {
      window.removeEventListener("scroll", onPageScroll);
      //window.removeEventListener("resize", onPageScroll);
    };
  }, );//[responsibilities.length]);*/

  return (
    <div ref={sectionRef}>
      <p className="opacity-[0.40] text-[16px] font-mono pb-[12px]">IDEATE</p>
      <p className="text-[32px] text-[#1F1F1F] font-semibold">{title}</p>
      <div className={"flex flex-col py-[40px] lg:pr-[70px] gap-[60px] align-middle items-start" + (reverse ? " min-[1250px]:flex-row-reverse" : " min-[1250px]:flex-row")}>
        <Image src={image} alt={`${title} image`} className="w-full min-[1250px]:w-[300px] min-[1400px]:w-[440px]"/> 

        <div className=" flex flex-row align-middle items-stretch">
          <div ref={scrollRef} className="bg-[#E2E2E2] h-auto outline-[2px] outline-[#E2E2E2] rounded-full overflow-visible relative w-[8px]">
            <div className="absolute left-0 top-0 w-full border-[2px] border-[#1F1F1F] bg-[#1F1F1F] rounded-full transition-[height] duration-200 ease-out" style={{height: `${scrollPos}px`}}></div>
          </div>
          <div className="flex gap-[57px] flex-col h-min px-[12px]">
            {responsibilities.map((responsibility, index) => (
              <div key={index} className="flex flex-col gap-[4px]">
                <div className="flex flex-row items-center gap-[4px]">
                  <Image src={responsibility.icon} alt={`${responsibility.title} icon`} className=""/>
                  {index == responsibilityIndex ? <p className="text-[20px] text-[#1F1F1F] font-semibold">{responsibility.title}</p> : <p className="text-[16px] text-[#ACACB9] font-semibold">{responsibility.title}</p>}
                </div>
                {index == responsibilityIndex && <p className="opacity-[0.65] text-[16px]">{responsibility.description}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface Tip { 
  icon?: StaticImageData;
  title?: string;
  tip: string;
}

function Tips({image, subtitle, title, description, tips, reverse} : {image: StaticImageData, subtitle: string, title: string, description: string, tips: Tip[], reverse: boolean}) {
  return (
    <div className={"flex flex-col gap-[60px] items-start" + (reverse ? " min-[1075px]:flex-row-reverse" : " min-[1075px]:flex-row")}>
      <Image src={image} alt={`${title} image`} className="w-full min-[1075px]:w-[440px]"/>
      <div className="flex flex-col gap-[12px]">
        <p className="text-[16px] opacity-[0.40] font-mono">{subtitle}</p>
        <p className="text-[20px] font-medium">{title}</p>
        <p className="text-[16px] opacity-[0.65]">{description}</p>
        <div className="w-full border-[1px] border-[#C0E4E6] rounded-full my-[8px] "/>
        {tips.map((tip, index) => (
          <div key={index} className="text-[16px] opacity-[0.65] flex flex-row gap-[8px] items-start">
            {tip.icon ? <Image src={tip.icon} alt={`${tip.title} icon`} className="" /> : <p className="text-nowrap">{`0${index + 1}.`}</p>}
            <div className="flex flex-row gap-[4px]">
              <p className="text-wrap">{tip.title && <span className="font-semibold text-nowrap">{tip.title}:</span>} {tip.tip}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


export default function Ideate() {
  return <div>Ideate</div>;
}
