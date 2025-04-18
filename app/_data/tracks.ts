import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import ipad from '@public/prizes/ipad.png';
import jblSpeaker from '@public/prizes/jbl_speaker.png';
import threeDPen from '@public/prizes/3d_pen.png';
import projector from '@public/prizes/projector.png';
import camera from '@public/prizes/4k_camera.png';
import headphones from '@public/prizes/beats_headphone.png';
import catPlushie from '@public/prizes/cute_cat_plushies.png';
import hdSwag from '@public/prizes/hd_swag.png';
import awsLogo from '@public/prizes/aws_logo.png';
import upscaleTickets from '@public/prizes/upscale_tickets.png';
import raspberryPi from '@public/prizes/raspberry_pi.png';
import claudeLogo from '@public/prizes/claude_logo.png';
import chatgptLogo from '@public/prizes/chatgpt_logo.png';
import wixLogo from '@public/prizes/wix_logo.png';
import fitbit from '@public/prizes/fitbit.png';
import logitechMouse from '@public/prizes/logitech_mouse.png';
import datalabLogo from '@public/prizes/datalab_logo.png';
import vectaraLogo from '@public/prizes/vectara_logo.png';
import hackingKit from '@public/prizes/hacking_kit.png';
import googleLogo from '@public/prizes/google_logo.png';
import jblHeadphones from '@public/prizes/jbl_headphones.png';
import iotKit from '@public/prizes/iot_kit.png';
import microphone from '@public/prizes/microphone.png';
import keyboard from '@public/prizes/keyboard.png';
import arduino from '@public/prizes/arduino.png';

interface TrackData {
  name: string;
  filter: string;
  prizes: string[];
  images: StaticImport[];
  eligibility_criteria: string;
  domain?: string;
  domainDisplayName?: string;
  scoring_criteria?: {
    attribute: string;
    guidelines: {
      1: string;
      3: string;
      5: string;
    };
  }[];
}

interface Tracks {
  [track: string]: TrackData;
}

const nonHDTracks: Tracks = {
  'Best Hack for California GovOps Agency': {
    name: 'Best Hack for California GovOps Agency',
    filter: 'Nonprofit',
    prizes: ['Plushie'],
    images: [catPlushie],
    eligibility_criteria:
      'California has the largest and most diverse population in the country. Our diversity is our strength, and the Governor is committed to a California for All. How can the state create analytics opportunities and solutions to support data-driven, culturally and demographically sensitive fire recovery, response, and survivor support? The state is not interested in “chat bot” proposals for this challenge.',
  },
  'Best Hack for NAMI Yolo': {
    name: 'Best Hack for NAMI Yolo',
    filter: 'Nonprofit',
    prizes: ['Plushie'],
    images: [catPlushie],
    eligibility_criteria:
      "NAMI Yolo is an organization that provides free mental health support and resources in Yolo County. It is primarily led by families, friends and individuals whose lives have been affected by mental illness. The organization heavily relies on trained volunteers to deliver educational programs, lead support groups, assist with events, and give community presentations. However, there is no unified system to track the entire volunteer process—from recruitment and onboarding to training, scheduling, and tracking volunteer hours. Additionally, it is important to track which courses each volunteer is trained to teach to ensure proper program delivery.  Currently, NAMI Yolo uses Google Drive and spreadsheets, which makes managing volunteer engagement and program coordination inefficient and time-consuming. To enhance organization and communication, NAMI Yolo seeks to implement a centralized volunteer management system that provides an intuitive interface for tracking volunteer activity, training history, and scheduling. How can we upgrade NAMI Yolo's current system to create a streamlined and effective volunteer management system?",
  },
  'Best Hack for Fourth and Hope': {
    name: 'Best Hack for Fourth and Hope',
    filter: 'Nonprofit',
    prizes: ['Plushie'],
    images: [catPlushie],
    eligibility_criteria:
      "Fourth and Hope provides essential services to individuals experiencing homelessness and housing insecurity, including meals, showers, shelter beds, etc. These services support both daily visitors and long-term residents, helping them access basic necessities and work toward stability. However, the organization does not have a centralized and efficient digital tool to track these services for each client, alongside their demographic data (e.g., ethnicity, language, age, gender), and outcomes over time. To enhance service coordination and data management, Fourth & Hope seeks to implement a secure and user-friendly digital intake and service-tracking system. This system should log daily service usage, track client demographics and progress, generate custom reports (e.g., number of showers given by age group), and help identify areas where additional support is needed. How can we improve upon Fourth & Hope's current system to create a comprehensive and efficient client service tracking system?",
  },
  'Best Open Data Hack': {
    name: 'Best Open Data Hack',
    filter: 'Technical',
    prizes: ['Luncheon and internship program invite', 'DataLab Swag bags'],
    images: [datalabLogo],
    eligibility_criteria:
      'To qualify, projects must use at least one publicly accessible dataset that relates to UC Davis to address questions of interest to our campus community. For consideration for this award, the team must produce a GitHub repository with a readME, annotated code, and a reproducible static data visualization. The visualization should have an accompanying 1-page narrative describing the goals, methods, and interpretation of the project.',
  },
  'Best Use of Cerebras API': {
    name: 'Best Use of Cerebras API',
    filter: 'Sponsor',
    prizes: ['Keychron Wireless Keyboard'],
    images: [keyboard],
    eligibility_criteria: 'Projects must use Cerebras API.',
  },
  'Best Use of Vectara': {
    name: 'Best Use of Vectara',
    filter: 'Sponsor',
    prizes: ['Vectara credits'],
    images: [vectaraLogo],
    eligibility_criteria:
      'Projects must use Vectara. Check out www.vectara.com/hacker-guide for their Hacker Guide!',
  },
  'Best Use of Gemini API': {
    name: 'Best Use of Gemini API',
    filter: 'MLH',
    prizes: ['Google Branded Backpacks'],
    images: [googleLogo],
    eligibility_criteria:
      "It's time to push the boundaries of what's possible with AI using Google Gemini. Check out the Gemini API to build AI-powered apps that make your friends say WHOA. So, what can Gemini do for your hackathon project? Understand language like a human and build a chatbot that gives personalized advice, analyze info like a supercomputer and create an app that summarizes complex research papers, generate creative content like code, scripts, music, and more! Think of the possibilities… what will you build with the Google Gemini API this weekend?",
  },
  'Best Use of MongoDB Atlas': {
    name: 'Best Use of MongoDB Atlas',
    filter: 'MLH',
    prizes: ['M5GO IoT Kit'],
    images: [iotKit],
    eligibility_criteria:
      "MongoDB Atlas takes the leading modern database and makes it accessible in the cloud! Get started with a $50 credit for students or sign up for the Atlas free forever tier (no credit card required). Along with a suite of services and functionalities, you'll have everything you need to manage all of your data, and you can get a headstart with free resources from MongoDB University! Build a hack using MongoDB Atlas for a chance to win a M5GO IoT Starter Kit for you and each member of your team.",
  },
  'Best .Tech Domain Name': {
    name: 'Best .Tech Domain Name',
    filter: 'MLH',
    prizes: [
      'Blue Snowball Microphone & a free .tech domain name for up to 10 years',
    ],
    images: [microphone],
    eligibility_criteria:
      "Make your Team's Achievements timeless: Win a .Tech Domain Name for up to 10 years to Showcase and Expand Your Project, Plus 4 Blue Snowball Mics for Effortless Collaboration on Zoom, empowering you to build even more cool things together!",
  },
  'Best Use of Auth0': {
    name: 'Best Use of Auth0',
    filter: 'MLH',
    prizes: ['Wireless Headphones'],
    images: [jblHeadphones],
    eligibility_criteria:
      "Auth0 wants your applications to be secure! Why spend hours building features like social sign-in, Multi-Factor Authentication, and passwordless log-in when you can enable them through Auth0 straight out of the box? Auth0 is free to try, doesn't require a credit card, and allows for up to 7,000 free active users and unlimited log-ins. Make your new account today and use any of the Auth0 APIs for a chance to win a pair of wireless headphones for you and each member of your team!",
  },
  'Best Use of Snowflake API': {
    name: 'Best Use of Snowflake API',
    filter: 'MLH',
    prizes: ['Arduino Tiny ML Kit'],
    images: [arduino],
    eligibility_criteria:
      "Play with industry-leading LLMs on a single account using the Snowflake APIs. Adding AI capabilities into your application can be as simple as a single CURL command to Snowflake's REST API. Build customized applications, RAG powered chat bots, or embed AI-powered features into your app in half the time with half the hassle. Get started for free with a special, student 120-day Snowflake trial and check out this repository for an example of the Snowflake REST API in action.",
  },
};

const automaticTracks: Tracks = {
  'Best Hack for Social Good': {
    name: 'Best Hack for Social Good',
    filter: 'General',
    prizes: ['IPad', 'JBL Speaker'],
    images: [ipad, jblSpeaker],
    eligibility_criteria:
      'Encapsulate your authentic idea of "social good". All entries are automatically considered for this prize category.',
  },
  "Hacker's Choice Award": {
    name: "Hacker's Choice Award",
    filter: 'General',
    prizes: ['HackDavis Swag Bag'],
    images: [hdSwag],
    eligibility_criteria:
      'Awarded to the project with the most votes from our 2025 hackers. All entries are automatically considered for this prize category. Vote for any project but your own!',
  },
};

const optedHDTracks: Tracks = {
  'Most Technically Challenging Hack': {
    name: 'Most Technically Challenging Hack',
    filter: 'Technical',
    prizes: ['AWS credits worth $250'],
    images: [awsLogo],
    eligibility_criteria:
      'Projects must showcase breadth and application of technical knowledge, including the use of complex algorithms or data structures, integration of multiple tools or technologies, and well-engineered implementation. Evaluated based on technical depth, system quality and performance/scalability.',
    domain: 'swe',
    domainDisplayName: 'Software Engineering',
    scoring_criteria: [
      {
        attribute: 'Technical Complexity of the Problem',
        guidelines: {
          1: 'Basic or well-known problem with low complexity.',
          3: 'Problem has multiple edge cases that require thoughtful design.',
          5: 'Highly complex or novel problem requiring significant technical insight.',
        },
      },
      {
        attribute: 'Quality of Engineering',
        guidelines: {
          1: 'Incomplete or poorly structured project; minimal components.',
          3: 'Implements organized architecture with clear separation of concerns and good practices.',
          5: 'Exceptionally well-engineered; modular, scalable, fault-tolerant and efficient.',
        },
      },
      {
        attribute: 'Integration of Tools or Techniques',
        guidelines: {
          1: 'Utilizes minimal external tools, frameworks, or libraries.',
          3: 'Uses advanced tools with purpose and understanding.',
          5: 'Integrates multiple advanced technologies/techniques (like parallelism, optimization, etc.) skillfully.',
        },
      },
    ],
  },
  'Best Beginner Hack': {
    name: 'Best Beginner Hack',
    filter: 'General',
    prizes: ["Tickets to Freepik's Upscale Conference"],
    images: [upscaleTickets],
    eligibility_criteria:
      'Every team member MUST be a first-time hacker in order to qualify. Demonstrate a high level of growth through this project. Foster creativity and collaboration within the team and display a commitment to building skills.',
    domain: 'swe',
    domainDisplayName: 'Software Engineering',
    scoring_criteria: [
      {
        attribute: 'Evidence of Learning and Growth',
        guidelines: {
          1: 'Little learning shown; reused known skills.',
          3: 'Used new tools or concepts with some success.',
          5: 'Strong grasp of entirely new topics; applied effectively.',
        },
      },
      {
        attribute: 'Team Collaboration',
        guidelines: {
          1: 'Disjointed teamwork; unclear roles.',
          3: 'Some coordination; shared effort.',
          5: 'Strong team balance; active support across roles.',
        },
      },
      {
        attribute: 'Problem-Solving and Persistence',
        guidelines: {
          1: 'Gave up easily or avoided addressing problems.',
          3: 'Worked through some challenges with effort.',
          5: 'Tackled tough issues with creative persistence.',
        },
      },
    ],
  },
  'Best Interdisciplinary Hack': {
    name: 'Best Interdisciplinary Hack',
    filter: 'General',
    prizes: ['3D Printing Pen'],
    images: [threeDPen],
    eligibility_criteria:
      'Leverage multiple perspectives across different disciplines to create a more well-rounded project. At least one member of the team needs to be a non-CS/CSE/otherwise CS-related major in order to qualify.',
    domain: 'swe',
    domainDisplayName: 'Software Engineering',
    scoring_criteria: [
      {
        attribute: 'Problem Selection',
        guidelines: {
          1: 'Problem could be solved within one discipline.',
          3: 'Problem benefits from multiple perspectives but is not very original.',
          5: "Highly original problem that requires all members' disciplines.",
        },
      },
      {
        attribute: 'Disciplinary Balance',
        guidelines: {
          1: 'All CS-related majors or one discipline heavily dominates the project.',
          3: 'Multiple disciplines with clear contributions.',
          5: 'Disciplines are deeply interwoven; equal importance given to insights from each field.',
        },
      },
      {
        attribute: 'Cross-Field Innovation',
        guidelines: {
          1: 'Disciplines barely connected/combined with unclear purpose.',
          3: 'Fields work together to enhance the solution.',
          5: 'True blend creating something impossible within one field.',
        },
      },
    ],
  },
  'Most Creative Hack': {
    name: 'Most Creative Hack',
    filter: 'General',
    prizes: ['Mini Projector'],
    images: [projector],
    eligibility_criteria:
      'Projects should demonstrate originality, showcase out-of-the-box thinking, and captivate its audience.',
    domain: 'business',
    domainDisplayName: 'Business',
    scoring_criteria: [
      {
        attribute: 'Originality of Concept',
        guidelines: {
          1: 'Common idea; similar to known projects.',
          3: 'Interesting twist or framing of a common idea.',
          5: 'Fresh, unexpected concept.',
        },
      },
      {
        attribute: 'Creative Execution',
        guidelines: {
          1: 'Conventional build; little imagination.',
          3: 'Some creative choices in implementation.',
          5: 'Inventive design; imaginative features.',
        },
      },
      {
        attribute: 'User Engagement',
        guidelines: {
          1: 'Uninspiring or hard to connect with.',
          3: 'Moderately interesting or novel.',
          5: 'Memorable and captivating experience.',
        },
      },
    ],
  },
  'Best Hardware Hack': {
    name: 'Best Hardware Hack',
    filter: 'Technical',
    prizes: ['Raspberry Pi Kit'],
    images: [raspberryPi],
    eligibility_criteria:
      'Effectively integrate a hardware component to your final project. The final project should be functional, user-friendly, and interactive.',
    domain: 'hardware',
    domainDisplayName: 'Hardware or Embedded Systems',
    scoring_criteria: [
      {
        attribute: 'Hardware Integration',
        guidelines: {
          1: 'Disconnected or non-functional hardware.',
          3: 'Working hardware with basic integration.',
          5: 'Seamless integration; essential to project.',
        },
      },
      {
        attribute: 'Feasibility and Technical Soundness',
        guidelines: {
          1: 'Unrealistic approach; unlikely to work outside controlled conditions.',
          3: 'Functional demo with some practical limitations or assumptions.',
          5: 'Well-grounded and executable design; feasible to reproduce or extend.',
        },
      },
      {
        attribute: 'User Interaction',
        guidelines: {
          1: 'Difficult to operate or requires technical knowledge to use.',
          3: 'Straightforward interaction with clear feedback to user actions.',
          5: 'Intuitive, responsive interaction that feels natural and engaging.',
        },
      },
    ],
  },
  'Best AI/ML Hack': {
    name: 'Best AI/ML Hack',
    filter: 'Technical',
    prizes: ['Claude API credits worth $750'],
    images: [claudeLogo],
    eligibility_criteria:
      'Project must demostrate unique or creative application of AI/ML, built on high-quality data, utilizing relevant algorithms and libraries and/or cloud platforms for development and evaluated with relevant performance metrics. Participants should show how their data was collected or sourced and clearly explain the reasoning or behavior of their AI. We encourage that models aim for generalization to unseen circumstances.',
    domain: 'aiml',
    domainDisplayName: 'Data Science or AI/ML',
    scoring_criteria: [
      {
        attribute: 'Necessity of AI/ML for Solving the Problem',
        guidelines: {
          1: 'Problem is obviously solvable with deterministic algorithms with more reliable output.',
          3: 'Problem can be solved with complex deterministic algorithms, but AI/ML is a reasonable choice.',
          5: 'Deterministic algorithms are unable to solve the problem. AI/ML is the only solution.',
        },
      },
      {
        attribute: 'Model Performance and Evaluation',
        guidelines: {
          1: 'Poor accuracy and generalization; minimal performance metrics.',
          3: 'Decent metrics; moderate evaluation efforts.',
          5: 'Strong results backed by solid metrics; tested on unseen data or edge cases.',
        },
      },
      {
        attribute: 'Technical Execution and Use of Tools',
        guidelines: {
          1: 'Surface-level use of tools; no customization or tuning.',
          3: 'Proper use of libraries with some tuning or data pipeline effort.',
          5: 'Deep technical execution with custom methods, advanced techniques, or strong tool mastery.',
        },
      },
    ],
  },
  'Best Hack for Social Justice': {
    name: 'Best Hack for Social Justice',
    filter: 'General',
    prizes: ['Digital Camera'],
    images: [camera],
    eligibility_criteria:
      'Hack must address a social justice issue such as racial inequality, economic injustice, environmental justice, etc. This project should develop tangible solutions and/or raise awareness on these topics.',
    domain: 'business',
    domainDisplayName: 'Business',
    scoring_criteria: [
      {
        attribute: 'Issue Understanding & Community Consideration',
        guidelines: {
          1: 'Surface-level grasp of the social issue; minimal thought about affected communities.',
          3: 'Good research and knowledge of the problem; considers needs of target communities.',
          5: 'Deep insight into nuances of the issue; clearly centers the voices and needs of affected groups.',
        },
      },
      {
        attribute: 'Advocacy Effectiveness',
        guidelines: {
          1: 'Passive presentation; no community engagement strategy.',
          3: 'Thoughtful awareness campaign with specific audience targeting.',
          5: 'Compelling call to action with practical pathways for audience involvement.',
        },
      },
      {
        attribute: 'Implementation Feasibility & Impact',
        guidelines: {
          1: 'Conceptual solution with significant barriers to deployment.',
          3: 'Viable prototype that could be developed with additional resources.',
          5: 'Ready-to-launch solution with demonstrated potential for measurable impact.',
        },
      },
    ],
  },
  'Best UI/UX Design': {
    name: 'Best UI/UX Design',
    filter: 'Design',
    prizes: ['Beats Studio Pro'],
    images: [headphones],
    eligibility_criteria:
      'Project includes beautiful design and intuitive web experiences that bring joy to users. Shows that the project is not only functional but also delightful, demonstrates wireframing, responsive design and promotes intuitive user experiences.',
    domain: 'design',
    domainDisplayName: 'UI/UX Design',
    scoring_criteria: [
      {
        attribute: 'Visual Design',
        guidelines: {
          1: 'Inconsistent style; cluttered or dull; poor accessibility.',
          3: 'Mostly clean design with some inconsistencies; some inclusive features.',
          5: 'Beautiful, cohesive, polished; thoughtful inclusivity.',
        },
      },
      {
        attribute: 'Navigation Flow',
        guidelines: {
          1: 'Confusing user journey; hard to find key actions.',
          3: 'Clear pathways through the interface with minor issues.',
          5: 'Effortless, intuitive navigation throughout.',
        },
      },
      {
        attribute: 'Design Process',
        guidelines: {
          1: 'Limited evidence of design planning.',
          3: 'Some wireframes or design iterations shown.',
          5: 'Comprehensive design process with wireframes to final product.',
        },
      },
    ],
  },
  'Best User Research': {
    name: 'Best User Research',
    filter: 'Design',
    prizes: ['6-month ChatGPT Plus Subscription'],
    images: [chatgptLogo],
    eligibility_criteria:
      'Awarded to a well-researched project that keeps its userbase in mind with an inclusive design aimed to maximize accessibility.',
    domain: 'design',
    domainDisplayName: 'UI/UX Design',
    scoring_criteria: [
      {
        attribute: 'User Understanding',
        guidelines: {
          1: 'Assumptions made with minimal research.',
          3: 'Clear effort to understand target users.',
          5: 'Comprehensive insights into user needs and behaviors.',
        },
      },
      {
        attribute: 'Depth of Research Methods',
        guidelines: {
          1: 'Few or irrelevant data points.',
          3: 'Basic research approach (like one survey).',
          5: 'Thoughtful combination of multiple research methods.',
        },
      },
      {
        attribute: 'Design Application & Feedback Integration',
        guidelines: {
          1: 'Research/feedback ignored or misaligned.',
          3: 'Limited connection between research and design; some user alignment.',
          5: 'Each design element directly tied to research findings.',
        },
      },
    ],
  },
  'Best Entrepreneurship Hack': {
    name: 'Best Entrepreneurship Hack',
    filter: 'Business',
    prizes: ['2-month WiX Business Subscription'],
    images: [wixLogo],
    eligibility_criteria:
      "No Code Required. A project that focuses on viability and persuasive power through presentation on the product/service you're trying to sell, relevant customer segments, distribution channels, and associated revenue/profit models.",
    domain: 'business',
    domainDisplayName: 'Business',
    scoring_criteria: [
      {
        attribute: 'Target Customer Clarity',
        guidelines: {
          1: 'Vague idea of potential users.',
          3: 'Defined customer segments with needs.',
          5: 'Detailed customer profiles with validated pain points.',
        },
      },
      {
        attribute: 'Business Model',
        guidelines: {
          1: 'Unclear how the project would make money.',
          3: 'Reasonable revenue model identified.',
          5: 'Well-thought-out pricing and monetization strategy.',
        },
      },
      {
        attribute: 'Market Differentiation',
        guidelines: {
          1: 'Little distinction from existing solutions.',
          3: 'Some unique selling points identified.',
          5: 'Clear competitive advantage with strong market positioning.',
        },
      },
    ],
  },
  'Best Statistical Model': {
    name: 'Best Statistical Model',
    filter: 'Business',
    prizes: ['Portable Hacking Kit'],
    images: [hackingKit],
    eligibility_criteria:
      "Projects must use exploratory data analysis (EDA) to guide their modeling decisions and hypotheses. Final models should include significance tests and be evaluated with metrics like MSE, R², adjusted R², precision, or recall, demonstrating clear statistical reasoning aligned with the project's core question or goal.",
    domain: 'aiml',
    domainDisplayName: 'Data Science or AI/ML',
    scoring_criteria: [
      {
        attribute: 'Exploratory Data Analysis',
        guidelines: {
          1: 'Minimal data exploration with basic statistics only.',
          3: 'Thoughtful exploration revealing patterns and relationships in the data.',
          5: 'Comprehensive EDA; insightful visualizations; directly informs model design.',
        },
      },
      {
        attribute: 'Use of Statistical Tests',
        guidelines: {
          1: 'Inappropriate or missing tests.',
          3: 'Some relevant tests included.',
          5: 'Proper tests applied correctly to the data and analysed.',
        },
      },
      {
        attribute: 'Results Interpretation',
        guidelines: {
          1: 'Unclear; hard to read; numbers presented with little explanation.',
          3: 'Some clarity in explanation; basic visualizations.',
          5: 'Insightful interpretation connecting statistics to real world.',
        },
      },
    ],
  },
  'Best Medical Hack': {
    name: 'Best Medical Hack',
    filter: 'Technical',
    prizes: ['Fitbit'],
    images: [fitbit],
    eligibility_criteria:
      'Revolutionize healthcare with technology! This category celebrates hacks that innovate in medical diagnostics, treatment, patient care, or healthcare accessibility.',
    domain: 'medtech',
    domainDisplayName: 'MedTech/BioTech',
    scoring_criteria: [
      {
        attribute: 'Relevance to a Real Medical Problem',
        guidelines: {
          1: "Vague or unclear medical application; doesn't address a meaningful or specific issue.",
          3: 'Addresses a relevant medical use case with some research and reasoning shown.',
          5: 'Clearly identifies a pressing medical need with evidence of research, user need, or potential impact.',
        },
      },
      {
        attribute: 'Feasibility of Implementation',
        guidelines: {
          1: 'Solution appears difficult to implement practically or lacks technical grounding.',
          3: 'Somewhat feasible; working prototype shown, though parts may be underdeveloped or theoretical.',
          5: 'Technically feasible with a working prototype that could realistically be deployed or scaled.',
        },
      },
      {
        attribute: 'Data Privacy, Security & Compliance',
        guidelines: {
          1: 'Lacks basic protections and ignores regulatory requirements.',
          3: 'Implements safeguards and is aware of HIPAA/GDPR.',
          5: 'Fully addresses privacy and security and demonstrates understanding of relevant regulations.',
        },
      },
    ],
  },
  // waiting on Med School groups for the next two tracks
  'Best Assistive Technology': {
    name: 'Best Assistive Technology',
    filter: 'Technical',
    prizes: ['Logitech Lift Mouse'],
    images: [logitechMouse],
    eligibility_criteria:
      'Empower individuals with disabilities through innovative assistive technology! This category recognizes projects that enhance accessibility, independence, and quality of life for people with disabilities.',
    domain: 'medtech',
    domainDisplayName: 'MedTech/BioTech',
    scoring_criteria: [
      {
        attribute: 'Accessibility Impact',
        guidelines: {
          1: "Minimal consideration for accessibility; doesn't address a specific disability or user group.",
          3: 'Targets a specific disability or accessibility need; partially addresses barriers.',
          5: 'Thoughtfully addresses a real accessibility challenge with a clear use case and significant potential to empower users.',
        },
      },
      {
        attribute: 'Customization & Personalization',
        guidelines: {
          1: 'One-size-fits-all interface with no user-adjustable settings; not adaptable to individual needs.',
          3: 'Offers a handful of presets or adjustable parameters (e.g. text size, volume), but limited depth.',
          5: 'Deep personalization: multiple adjustable modalities (voice, touch, gesture), fine-tunable settings, user profiles saved for repeat use.',
        },
      },
      {
        attribute: 'Inclusive Design',
        guidelines: {
          1: 'Minimal or no accessibility considerations; uses hard-to-read fonts, poor color contrast, or inaccessible controls.',
          3: 'Addresses some accessibility needs (e.g., high contrast mode, keyboard navigation), but lacks full inclusivity or testing.',
          5: 'Demonstrates comprehensive inclusive design—supports color blindness (e.g., non-color-based cues), screen reader compatibility, keyboard-only navigation, simple language, clear layout, cognitive-friendly design, etc.',
        },
      },
    ],
  },
};

const allTracks: Tracks = {
  ...automaticTracks,
  ...optedHDTracks,
  ...nonHDTracks,
};

const displayNameToDomainMap: Map<string, string> = new Map(
  Object.entries(optedHDTracks).map(([_, value]) => [
    value.domainDisplayName ?? '',
    value.domain ?? '',
  ])
);

export {
  allTracks,
  optedHDTracks,
  automaticTracks,
  nonHDTracks,
  displayNameToDomainMap,
};
export const bestHackForSocialGood =
  uncategorizedTracks['Best Hack for Social Good'];
export type { TrackData, Tracks };
