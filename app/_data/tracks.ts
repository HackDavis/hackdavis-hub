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
      'The California Government Operations Agency works to advance effectiveness, efficiency, and equity in state operations. In light of recent events, craft an analytics solutions that support data-driven fire recovery, response, and survivor support. The state is not interested in “chat bot” proposals for this challenge.',
  },
  'Best Hack for NAMI Yolo': {
    name: 'Best Hack for NAMI Yolo',
    filter: 'Nonprofit',
    prizes: ['Plushie'],
    images: [catPlushie],
    eligibility_criteria:
      'The Yolo County chapter of National Alliance on Mental Illness provides free mental health support and resources in Yolo County and heavily relies on trained volunteers. Implement a centralized volunteer management system that provides an intuitive interface for tracking volunteer activity, training history, and scheduling.',
  },
  'Best Hack for Fourth and Hope': {
    name: 'Best Hack for Fourth and Hope',
    filter: 'Nonprofit',
    prizes: ['Plushie'],
    images: [catPlushie],
    eligibility_criteria:
      'Fourth & Hope provides essential services to individuals experiencing homelessness and housing insecurity, including meals, showers, shelter beds, etc. Build a secure and user-friendly digital intake and service-tracking system to enhance service coordination and data management.',
  },
  'Best Open Data Hack': {
    name: 'Best Open Data Hack',
    filter: 'Technical',
    prizes: ['Luncheon and internship program invite', 'DataLab Swag bags'],
    images: [datalabLogo],
    eligibility_criteria:
      'Projects must use at least one publicly accessible dataset that relates to UC Davis to address questions of interest to our campus community. For consideration for this award, the team must produce a GitHub repository with a readME, annotated code, and a reproducible static data visualization. The visualization should have an accompanying 1-page narrative describing the goals, methods, and interpretation of the project.',
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
      "It’s time to push the boundaries of what's possible with AI using Google Gemini. Check out the Gemini API to build AI-powered apps that make your friends say WHOA. So, what can Gemini do for your hackathon project? Think of the possibilities… what will you build with the Google Gemini API this weekend?",
  },
  'Best Use of MongoDB Atlas': {
    name: 'Best Use of MongoDB Atlas',
    filter: 'MLH',
    prizes: ['M5GO IoT Kit'],
    images: [iotKit],
    eligibility_criteria:
      "MongoDB Atlas takes the leading modern database and makes it accessible in the cloud!  Along with a suite of services and functionalities, you'll have everything you need to manage all of your data, and you can get a headstart with free resources from MongoDB University! Build a hack using MongoDB Atlas",
  },
  'Best .Tech Domain Name': {
    name: 'Best .Tech Domain Name',
    filter: 'MLH',
    prizes: [
      'Blue Snowball Microphone & a free .tech domain name for up to 10 years',
    ],
    images: [microphone],
    eligibility_criteria:
      "Make your team's achievements timeless! Win a .tech domain name for up to 10 years to showcase and expand Your project, and a blue Snowball Mic for effortless collaboration on Zoom, empowering you to build even more cool things together!",
  },
  'Best Use of Auth0': {
    name: 'Best Use of Auth0',
    filter: 'MLH',
    prizes: ['Wireless Headphones'],
    images: [jblHeadphones],
    eligibility_criteria:
      'Auth0 wants your applications to be secure! Why spend hours building features like social sign-in, Multi-Factor Authentication, and passwordless log-in when you can enable them through Auth0 straight out of the box? Auth0 is free to try, doesn’t require a credit card, and allows for up to 7,000 free active users and unlimited log-ins. Use any of the Auth0 APIs in your project.',
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
        attribute: 'Depth and Quality of Engineering',
        guidelines: {
          1: 'Incomplete or poorly structured project; limited depth.',
          3: 'Solid implementation with good practices and structure.',
          5: 'Exceptionally well-engineered; modular, robust, scalable and performant.',
        },
      },
      {
        attribute: 'Use of Advanced Tools or Techniques',
        guidelines: {
          1: 'Relies on basic technologies.',
          3: 'Uses advanced tools (frameworks/APIs/libraries) with purpose and understanding.',
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
          1: 'Little learning shown; reused known skills',
          3: 'Used new tools or concepts with some success',
          5: 'Strong grasp of entirely new topics; applied effectively',
        },
      },
      {
        attribute: 'Team Collaboration',
        guidelines: {
          1: 'Disjointed teamwork; unclear roles',
          3: 'Some coordination; shared effort',
          5: 'Strong team balance; active support across roles',
        },
      },
      {
        attribute: 'Problem-Solving and Persistence',
        guidelines: {
          1: 'Gave up easily or avoided hard problems',
          3: 'Worked through some challenges with effort',
          5: 'Tackled tough issues with creative persistence',
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
        attribute: 'Integration of Multiple Disciplines',
        guidelines: {
          1: 'All CS-related majors or fields combined with unclear purpose/synergy.',
          3: 'Disciplines are clearly applied and work together.',
          5: 'Disciplines are deeply interwoven; project depends on insights from each field to work.',
        },
      },
      {
        attribute: 'Innovation in Cross-Disciplinary Problem-Solving',
        guidelines: {
          1: 'Conventional approach with little interplay between disciplines.',
          3: 'Some novel ideas emerge from blending fields; mostly conventional execution.',
          5: 'Brilliant unexpected solution made possible by this unique mix of disciplines.',
        },
      },
      {
        // dont like this too much, would rather replace w a new criterion
        attribute: 'Collaboration Across Disciplines',
        guidelines: {
          1: 'Limited collaboration, causing confusion or inefficiencies.',
          3: 'Good teamwork with some knowledge-sharing across disciplines.',
          5: 'Worked fluidly; ideas, roles and skills were shared and combined seamlessly.',
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
          1: 'Common idea; similar to known projects',
          3: 'Interesting twist or framing',
          5: 'Fresh, unexpected concept',
        },
      },
      {
        attribute: 'Creative Execution',
        guidelines: {
          1: 'Conventional build; little imagination',
          3: 'Some creative choices in implementation',
          5: 'Inventive design; imaginative features',
        },
      },
      {
        attribute: 'User Engagement',
        guidelines: {
          1: 'Uninspiring or hard to connect with',
          3: 'Moderately interesting or novel',
          5: 'Memorable and captivating experience',
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
          1: 'Disconnected or non-functional hardware',
          3: 'Working hardware with basic integration',
          5: 'Seamless integration; essential to project',
        },
      },
      {
        attribute: 'Hardware Design and Creativity',
        guidelines: {
          1: 'Generic components; standard use',
          3: 'Some custom elements or unusual applications',
          5: 'Unique design; innovative use of components',
        },
      },
      {
        attribute: 'Interactivity and Usability',
        guidelines: {
          1: 'Hard to use or test',
          3: 'Basic user experience; limited feedback',
          5: 'Smooth interaction; enjoyable experience',
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
        attribute: 'Innovation in AI/ML Application',
        guidelines: {
          1: 'Off-the-shelf or basic use of AI/ML tools.',
          3: 'Some creativity in model use or application context.',
          5: 'Unique or inventive AI/ML integration, solving a novel problem or using an unexpected technique.',
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
    domain: 'swe',
    domainDisplayName: 'Software Engineering',
    scoring_criteria: [
      {
        attribute: 'Social Justice Relevance',
        guidelines: {
          1: 'Loose connection; unclear purpose',
          3: 'Clearly linked to a real issue',
          5: 'Sharp focus on impactful issue',
        },
      },
      {
        attribute: 'Advocacy and Awareness',
        guidelines: {
          1: 'No call to action or outreach',
          3: 'Some effort to inform or engage',
          5: 'Strong call to action; inspires involvement',
        },
      },
      {
        attribute: 'Potential for Real-World Impact',
        guidelines: {
          1: 'Unlikely to create change',
          3: 'Plausible concept with room to grow',
          5: 'Clear, actionable path to real impact',
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
      'Project includes beautiful design and intuitive web experiences that bring joy to users. Shows that the project is not only functional but also delightful, demonstrates wireframing, responsive design and promots intuitive user experiences.',
    domain: 'design',
    domainDisplayName: 'UI/UX Design',
    scoring_criteria: [
      {
        attribute: 'Visual Design',
        guidelines: {
          1: 'Inconsistent style; cluttered or dull',
          3: 'Mostly clean design with some inconsistencies',
          5: 'Cohesive, polished, and visually appealing',
        },
      },
      {
        attribute: 'User Flow and Navigation',
        guidelines: {
          1: 'Confusing paths; hard to find key actions',
          3: 'Reasonable flow with minor issues',
          5: 'Clear, intuitive journey throughout',
        },
      },
      {
        attribute: 'Accessibility and Responsiveness',
        guidelines: {
          1: 'Limited device support; poor accessibility',
          3: 'Mostly responsive; some inclusive features',
          5: 'Accessible across devices; thoughtful inclusivity',
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
        attribute: 'Research Depth',
        guidelines: {
          1: 'Few or irrelevant data points',
          3: 'Some effort to gather user needs',
          5: 'Extensive, targeted research',
        },
      },
      {
        attribute: 'Feedback Integration',
        guidelines: {
          1: 'Feedback ignored or misaligned',
          3: 'Partial integration; some user alignment',
          5: 'Strong alignment; clear influence of feedback',
        },
      },
      {
        attribute: 'Creative Problem Fit',
        guidelines: {
          1: 'Generic solution; weak fit to users',
          3: 'Some alignment with user needs',
          5: 'Clever, well-matched solution to user goals',
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
        attribute: 'Business Model Viability',
        guidelines: {
          1: 'No clear model or unrealistic assumptions',
          3: 'Some viability; needs refinement',
          5: 'Compelling, realistic model',
        },
      },
      {
        attribute: 'Pitch Effectiveness',
        guidelines: {
          1: 'Unclear or unconvincing pitch',
          3: 'Decent clarity; some persuasion',
          5: 'Clear, persuasive, well-structured pitch',
        },
      },
      {
        attribute: 'Market Insight',
        guidelines: {
          1: 'Vague or missing audience info',
          3: 'Some understanding of user base',
          5: 'Well-defined market; strategic focus',
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
      'Projects must seamlessly incorporate significance tests that evaluate a hypothesis based on their primary question or project goal, with an emphasis on accuracy metrics such as MSE, R^2, adjusted R^2, precision and recall.',
    domain: 'aiml',
    domainDisplayName: 'Data Science or AI/ML',
    scoring_criteria: [
      {
        attribute: 'Model Accuracy and Reliability',
        guidelines: {
          1: 'High error; weak predictions',
          3: 'Reasonable accuracy; moderate metrics',
          5: 'Consistently reliable; strong metrics',
        },
      },
      {
        attribute: 'Use of Statistical Tests',
        guidelines: {
          1: 'Wrong or missing tests',
          3: 'Some relevant tests included',
          5: 'Appropriate, well-used tests',
        },
      },
      {
        attribute: 'Output Interpretability',
        guidelines: {
          1: 'Unclear or hard to read',
          3: 'Some clarity; basic visualizations',
          5: 'Clear insights; easy to understand',
        },
      },
    ],
  },
  // waiting on Med School groups for the next two tracks
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
        attribute: 'Relevance to health and well-being themes',
        guidelines: {
          1: 'Minimal relevance to health topics.',
          3: 'Moderate relevance with some impact.',
          5: 'Highly relevant with significant health impact.',
        },
      },
      {
        attribute:
          'Effectiveness in addressing accessibility or service issues',
        guidelines: {
          1: 'Limited effectiveness with minimal impact.',
          3: 'Moderate effectiveness with some impact.',
          5: 'Highly effective with significant positive impact.',
        },
      },
      {
        attribute: 'Potential for real-world application',
        guidelines: {
          1: 'Minimal potential with unlikely application.',
          3: 'Moderate potential with some applicability.',
          5: 'High potential with clear real-world applicability.',
        },
      },
    ],
  },
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
        attribute: 'Relevance to health and well-being themes',
        guidelines: {
          1: 'Minimal relevance to health topics.',
          3: 'Moderate relevance with some impact.',
          5: 'Highly relevant with significant health impact.',
        },
      },
      {
        attribute:
          'Effectiveness in addressing accessibility or service issues',
        guidelines: {
          1: 'Limited effectiveness with minimal impact.',
          3: 'Moderate effectiveness with some impact.',
          5: 'Highly effective with significant positive impact.',
        },
      },
      {
        attribute: 'Potential for real-world application',
        guidelines: {
          1: 'Minimal potential with unlikely application.',
          3: 'Moderate potential with some applicability.',
          5: 'High potential with clear real-world applicability.',
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
export type { TrackData, Tracks };
