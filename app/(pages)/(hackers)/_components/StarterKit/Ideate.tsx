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
  // Data
  const designer_responsibilities = [
    {icon: writing_sign, title: "Research problem statement", description: "A problem statement should include: background, people affected, and the impact of the problem."},
    {icon: figma, title: "Craft UI/UX visuals", description: "Create wireframes, mockups, and prototypes that bring the product vision to life."},
    {icon: sparkles, title: "Iterate on feedback & refine", description: "Collaborate with your team, gather insights, and polish the design through multiple iterations."},
    {icon: presentation_analytics, title: "Create presentation & pitch", description: "Be prepared to present design decisions, rationale, and final deliverables to the judges!"},
  ]

  const developer_responsibilities = [
    {icon: writing_sign, title: "Plan out system design", description: "Figure out what tech stack and technologies you want to use for your product."},
    {icon: github, title: "Set up codebase scaffolding", description: "Create a GitHub repo and initialize the project so your team can collaborate."},
    {icon: message_chatbot, title: "Divide and conquer", description: "Split the product into features and assign tasks so teammates can build in parallel."},
    {icon: desktop_code, title: "Build a functioning demo", description: "Implement core features and ensure you have a working product ready for presentations."},
  ]

  const design_tips1 = [
    {tip: "Go in the left panel and navigate to Assets"},
    {tip: "Press Add more libraries"},
    {tip: "Click UI Kits on the left panel in the Libraries Module"},
    {tip: "Add your preferred library to your design file!"},
  ]

  const design_tips2 = [
    {icon: shape, title: "Iconify", tip: "A library of  100,000+ icons."},
    {icon: image_in_picture, title: "Remove BG", tip: "Removes the background of any photo instantly."},
    {icon: text_size, title: "Stark", tip: "Checks if your text is readable for accessibility."},
  ]

  const designer_link1 = {
    type: "FIGMA COURSE",
    title: "Figma for Beginners",
    description: "New to Figma? This hands-on course offers a quick tour of key features, while guiding you through designing a portfolio website from scratch.",
    image: figma_beginners_image,
    buttonName: "Start Course", 
    link: "https://help.figma.com/hc/en-us/sections/30880632542743-Figma-Design-for-beginners",
    alt: "Figma Design For Beginners course preview image",
  }

  const designer_link2 = {
    type: "FIGMA BLOG",
    title: "What is Product Design?",
    description: "How can you create the best product or service for your users? This article by Figma explains how Product Design is the process of developing experiences to meet user needs and align with business goals + strategies.",
    image: figma_shapes,
    buttonName: "Read", 
    link: "https://www.figma.com/resource-library/what-is-product-design/",
    alt: "What is product design blog post preview image",
  }

  const developer_link1 = {
    type: "MLH STARTER KIT",
    title: "Get Started with MongoDB",
    description: "Whether you are new to MongoDB or looking for a little inspiration to get your hackathon project started, the MongoDB Developer Center has all the latest MongoDB tutorials, videos and code examples featuring over a dozen programming languages, and even more technology integrations!",
    image: mongodb,
    buttonName: "Read", 
    link: "https://news.mlh.io/read-and-write-to-a-mongodb-atlas-database-in-minutes-04-19-2023?utm_source=mlh&utm_medium=referral&utm_content=MongoDB+Starter+Kit",
    alt: "MongoDB logo",
  }

  const developer_link2 = {
    type: "MLH STARTER KIT",
    title: "Get Started with Authentication",
    description: "Auth0 is an easy to use authentication and authorization platform! If your hackathon project requires a log in and sign up workflow, Auth0 supports this functionality straight out of the box. Best of all, it’s simple and free to get started.",
    image: auth0,
    buttonName: "Read", 
    link: "https://news.mlh.io/enable-user-authentication-for-your-hackathon-project-in-as-little-as-ten-minutes-05-12-2023?utm_source=mlh&utm_medium=referral&utm_content=Auth0+Starter+Kit",
    alt: "Auth0 logo",

  }

  return (
  <div className="flex flex-col bg-[#D5FDFF] py-[80px] md:py-[120px] px-[16px] md:px-[120px] gap-[160px] items-center">
    {/** Section 1 */}
    <div>
      <Responsibilities image={designer_responsibilities_image} title="Designer Responsibilities" responsibilities={designer_responsibilities} reverse={false}/>
    </div>

    {/** Section 2 */}
    <div className="">
      <p className="text-[20px] text-[#1F1F1F] font-semibold pb-[32px]">Design Tips</p>
      <Tips image={designer_tips1_image} subtitle="SPEED UP YOUR DESIGNING x100000" title="Add pre-made, customizable design templates" description="Using UI kits can accelerate your process and give you more time to focus on problem solving and development!" tips={design_tips1} reverse={false}/>
    </div>

    {/** Section 3 */}
    <div>
      <Tips image={designer_tips2_image} subtitle="EXPLORE PLUGINS" title="Work Smarter with Plugins" description='Don’t build from scratch when there’s a plugin for it. Plugins are "mini-apps" inside Figma that do the tedious work for you! To find them, just press Ctrl + / (Windows) or Cmd + / (Mac) and type the name, or find it in the bottom toolbar.' tips={design_tips2} reverse={true}/>
    </div>

    {/** Section 4 */}
    <div>
      <Resources title="Resources" link1={designer_link1} link2={designer_link2} />
    </div>

    {/** Section 5 */}
    <div>
      <Responsibilities image={developer_responsibilities_image} title="Developer Responsibilities" responsibilities={developer_responsibilities} reverse={true}/>
    </div>

    {/** Section 6 */}
    <div>
      <Resources title="Resources" link1={developer_link1} link2={developer_link2} />
    </div>

    {/** Section 7 */}
    <div>
      <p className="opacity-[0.40] text-[16px] font-mono pb-[12px]">OUR RECOMMENDED BREAKDOWN TO</p>
      <p className="text-[32px] text-[#1F1F1F] font-semibold">Keep track of time</p>
      <Image src={timeline} alt="timeline" className="scale-[110%] md:scale-[100%]" />
    </div>
  </div>
  );
}
