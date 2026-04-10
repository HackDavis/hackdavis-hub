'use client';

import Image from 'next/image';

// Components
import { Resources } from './Resources';
import { Responsibilities } from './Responsibilities';
import { Tips } from './Tips';

// Icons
import writing_sign from '@public/hackers/starter-kit/resources/tabler_writing-sign.svg';
import presentation_analytics from '@public/hackers/starter-kit/resources/tabler_presentation-analytics.svg';
import sparkles from '@public/hackers/starter-kit/resources/tabler_sparkles-2.svg';
import figma from '@public/hackers/starter-kit/resources/tabler_brand-figma.svg';

import github from '@public/hackers/starter-kit/resources/tabler_brand-github.svg';
import desktop_code from '@public/hackers/starter-kit/resources/tabler_device-desktop-code.svg';
import message_chatbot from '@public/hackers/starter-kit/resources/tabler_message-chatbot.svg';

import text_size from '@public/hackers/starter-kit/resources/tabler_text-size.svg';
import image_in_picture from '@public/hackers/starter-kit/resources/tabler_image-in-picture.svg';
import shape from '@public/hackers/starter-kit/resources/tabler_shape.svg';

// Big Images
import designer_responsibilities_image from '@public/hackers/starter-kit/resources/designer_responsibilities.svg';
import developer_responsibilities_image from '@public/hackers/starter-kit/resources/developer_responsibilities.svg';
import designer_tips1_image from '@public/hackers/starter-kit/resources/designer_tips1.svg';
import designer_tips2_image from '@public/hackers/starter-kit/resources/designer_tips2.svg';

import figma_beginners_image from '@public/hackers/starter-kit/resources/figma_beginners.svg';
import figma_shapes from '@public/hackers/starter-kit/resources/figma_shapes.svg';
import mongodb from '@public/hackers/starter-kit/resources/mongodb.svg';
import auth0 from '@public/hackers/starter-kit/resources/auth0.svg';

import timeline from '@public/hackers/starter-kit/resources/timeline.svg';

// Extra
//import scroll_bar1 from '@public/hackers/starter-kit/resources/scroll_bar1.svg';
//import divider from '@public/hackers/starter-kit/resources/divider.svg';

export default function DesignDevResources() {
  // Data
  const designer_responsibilities = [
    {
      icon: writing_sign,
      title: 'Research problem statement',
      description:
        'A problem statement should include: background, people affected, and the impact of the problem.',
    },
    {
      icon: figma,
      title: 'Craft UI/UX visuals',
      description:
        'Create wireframes, mockups, and prototypes that bring the product vision to life.',
    },
    {
      icon: sparkles,
      title: 'Iterate on feedback & refine',
      description:
        'Collaborate with your team, gather insights, and polish the design through multiple iterations.',
    },
    {
      icon: presentation_analytics,
      title: 'Create presentation & pitch',
      description:
        'Be prepared to present design decisions, rationale, and final deliverables to the judges!',
    },
  ];

  const developer_responsibilities = [
    {
      icon: writing_sign,
      title: 'Plan out system design',
      description:
        'Figure out what tech stack and technologies you want to use for your product.',
    },
    {
      icon: github,
      title: 'Set up codebase scaffolding',
      description:
        'Create a GitHub repo and initialize the project so your team can collaborate.',
    },
    {
      icon: message_chatbot,
      title: 'Divide and conquer',
      description:
        'Split the product into features and assign tasks so teammates can build in parallel.',
    },
    {
      icon: desktop_code,
      title: 'Build a functioning demo',
      description:
        'Implement core features and ensure you have a working product ready for presentations.',
    },
  ];

  const design_tips1 = [
    { tip: 'Go in the left panel and navigate to Assets' },
    { tip: 'Press Add more libraries' },
    { tip: 'Click UI Kits on the left panel in the Libraries Module' },
    { tip: 'Add your preferred library to your design file!' },
  ];

  const design_tips2 = [
    { icon: shape, title: 'Iconify', tip: 'A library of  100,000+ icons.' },
    {
      icon: image_in_picture,
      title: 'Remove BG',
      tip: 'Removes the background of any photo instantly.',
    },
    {
      icon: text_size,
      title: 'Stark',
      tip: 'Checks if your text is readable for accessibility.',
    },
  ];

  const designer_link1 = {
    type: 'FIGMA COURSE',
    title: 'Figma for Beginners',
    description:
      'New to Figma? This hands-on course offers a quick tour of key features, while guiding you through designing a portfolio website from scratch.',
    image: figma_beginners_image,
    buttonName: 'Start Course',
    link: 'https://help.figma.com/hc/en-us/sections/30880632542743-Figma-Design-for-beginners',
    alt: 'Figma Design For Beginners course preview image',
  };

  const designer_link2 = {
    type: 'FIGMA BLOG',
    title: 'What is Product Design?',
    description:
      'How can you create the best product or service for your users? This article by Figma explains how Product Design is the process of developing experiences to meet user needs and align with business goals + strategies.',
    image: figma_shapes,
    buttonName: 'Read',
    link: 'https://www.figma.com/resource-library/what-is-product-design/',
    alt: 'What is product design blog post preview image',
  };

  const developer_link1 = {
    type: 'MLH STARTER KIT',
    title: 'Get Started with MongoDB',
    description:
      'Whether you are new to MongoDB or looking for a little inspiration to get your hackathon project started, the MongoDB Developer Center has all the latest MongoDB tutorials, videos and code examples featuring over a dozen programming languages, and even more technology integrations!',
    image: mongodb,
    buttonName: 'Read',
    link: 'https://news.mlh.io/read-and-write-to-a-mongodb-atlas-database-in-minutes-04-19-2023?utm_source=mlh&utm_medium=referral&utm_content=MongoDB+Starter+Kit',
    alt: 'MongoDB logo',
  };

  const developer_link2 = {
    type: 'MLH STARTER KIT',
    title: 'Get Started with Authentication',
    description:
      'Auth0 is an easy to use authentication and authorization platform! If your hackathon project requires a log in and sign up workflow, Auth0 supports this functionality straight out of the box. Best of all, it’s simple and free to get started.',
    image: auth0,
    buttonName: 'Read',
    link: 'https://news.mlh.io/enable-user-authentication-for-your-hackathon-project-in-as-little-as-ten-minutes-05-12-2023?utm_source=mlh&utm_medium=referral&utm_content=Auth0+Starter+Kit',
    alt: 'Auth0 logo',
  };

  return (
    <div className="flex flex-col bg-[#D5FDFF] py-[7%] px-[4%] gap-[112px] md:gap-[144px] items-center">
      {/** Section 1 */}
      <div id="design-resources">
        <Responsibilities
          image={designer_responsibilities_image}
          title="Designer Responsibilities"
          responsibilities={designer_responsibilities}
          reverse={false}
        />
      </div>

      {/** Section 2 */}
      <div className="">
        <p className="text-[20px] text-[#1F1F1F] font-semibold pb-[32px]">
          Design Tips
        </p>
        <Tips
          image={designer_tips1_image}
          subtitle="SPEED UP YOUR DESIGNING x100000"
          title="Add pre-made, customizable design templates"
          description="Using UI kits can accelerate your process and give you more time to focus on problem solving and development!"
          tips={design_tips1}
          reverse={false}
        />
      </div>

      {/** Section 3 */}
      <div>
        <Tips
          image={designer_tips2_image}
          subtitle="EXPLORE PLUGINS"
          title="Work Smarter with Plugins"
          description='Don’t build from scratch when there’s a plugin for it. Plugins are "mini-apps" inside Figma that do the tedious work for you! To find them, just press Ctrl + / (Windows) or Cmd + / (Mac) and type the name, or find it in the bottom toolbar.'
          tips={design_tips2}
          reverse={true}
        />
      </div>

      {/** Section 4 */}
      <div>
        <Resources
          title="Resources"
          link1={designer_link1}
          link2={designer_link2}
        />
      </div>

      {/** Section 5 */}
      <div id="dev-resources">
        <Responsibilities
          image={developer_responsibilities_image}
          title="Developer Responsibilities"
          responsibilities={developer_responsibilities}
          reverse={true}
        />
      </div>

      {/** Section 6 */}
      <div>
        <Resources
          title="Resources"
          link1={developer_link1}
          link2={developer_link2}
        />
      </div>

      {/** Section 7 */}
      <div className="w-full">
        <p className="opacity-[0.40] text-[16px] font-mono pb-[12px]">
          OUR RECOMMENDED BREAKDOWN TO
        </p>
        <p className="text-[32px] text-[#1F1F1F] font-semibold">
          Keep track of time
        </p>
        <Image
          src={timeline}
          alt="timeline"
          className="block mx-auto scale-[110%] md:scale-[100%]"
        />
      </div>
    </div>
  );
}
