import { StaticImport } from 'next/dist/shared/lib/get-img-props';

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

const uncategorizedTracks: Tracks = {
  'Best Hack for Social Good': {
    name: 'Best Hack for Social Good',
    filter: 'General',
    prizes: ['IPad', 'JBL Charge 5'],
    images: [],
    eligibility_criteria:
      'Encapsulate your authentic idea of "social good". All entries are automatically considered for this prize category.',
  },
  'Best Open Data Hack': {
    name: 'Best Open Data Hack',
    filter: 'Technical',
    prizes: ['Luncheon and internship program invite', '2nd Place: Swag bags'],
    images: [],
    eligibility_criteria:
      'Projects must use at least one publicly accessible dataset that relates to UC Davis to address questions of interest to our campus community. For consideration for this award, the team must produce a GitHub repository with a readME, annotated code, and a reproducible static data visualization. The visualization should have an accompanying 1-page narrative describing the goals, methods, and interpretation of the project.',
  },
  "Hacker's Choice Award": {
    name: "Hacker's Choice Award",
    filter: 'General',
    prizes: ['HackDavis Swag Bag'],
    images: [],
    eligibility_criteria:
      'Awarded to the project with the most votes from our 2025 hackers. Vote for any project but your own!',
  },
  'Best Hack for California GovOps Agency': {
    name: 'Best Hack for California GovOps Agency',
    filter: 'Nonprofit',
    prizes: ['1 Plushie'],
    images: [],
    eligibility_criteria: 'TBA',
  },
  'Best Hack for NAMI Yolo': {
    name: 'Best Hack for NAMI Yolo',
    filter: 'Nonprofit',
    prizes: ['1 Plushie'],
    images: [],
    eligibility_criteria:
      'NAMI Yolo provides free mental health support and resources in Yolo County and heavily relies on trained volunteers. Implement a centralized volunteer management system that provides an intuitive interface for tracking volunteer activity, training history, and scheduling',
  },
  'Best Hack for Fourth and Hope': {
    name: 'Best Hack for Fourth and Hope',
    filter: 'Nonprofit',
    prizes: ['1 Plushie'],
    images: [],
    eligibility_criteria:
      'Fourth & Hope provides essential services to individuals experiencing homelessness and housing insecurity, including meals, showers, shelter beds, etc. Build a secure and user-friendly digital intake and service-tracking system to enhance service coordination and data management',
  },
  'Best Use of Cerebras API': {
    name: 'Best Use of Cerebras API',
    filter: 'Technical',
    prizes: ['TBA'],
    images: [],
    eligibility_criteria: '',
  },
};

const categorizedTracks: Tracks = {
  'Best Beginner Hack': {
    name: 'Best Beginner Hack',
    filter: 'General',
    prizes: ['13-month Hugging Face Pro Subscription'],
    images: [],
    eligibility_criteria:
      'Every team member must be a first-time hacker in order to qualify. Demonstrate a high level of growth through this project. Foster creativity and collaboration within the team and display a committment to building skills.',
    domain: 'swe',
    domainDisplayName: 'Software Engineering',
    scoring_criteria: [
      {
        attribute: 'Learning and growth demonstrated',
        guidelines: {
          1: 'Little to no evidence of personal or team growth.',
          3: 'Moderate improvement with some evidence of learning.',
          5: 'Exceptional personal/team growth, with clear evidence of learning new tools, technologies, and approaches to problem-solving.',
        },
      },
      {
        attribute: 'Effective teamwork and collaboration among beginners',
        guidelines: {
          1: 'Limited teamwork with minimal collaboration.',
          3: 'Some teamwork with occasional collaboration.',
          5: 'Excellent teamwork with strong collaboration.',
        },
      },
      {
        attribute: 'Commitment to overcoming challenges and building skills',
        guidelines: {
          1: 'Minimal effort to overcome challenges.',
          3: 'Moderate effort with some success.',
          5: 'Exceptional determination and skill-building.',
        },
      },
    ],
  },
  'Best Interdisciplinary Hack': {
    name: 'Best Interdisciplinary Hack',
    filter: 'General',
    prizes: ['3D Printing Pen'],
    images: [],
    eligibility_criteria:
      'Leverage multiple perspectives across different disciplines to create a more well-rounded project. At least one member of the team needs to be a non-CS/CSE/otherwise CS-related major in order to qualify.',
    domain: 'swe',
    domainDisplayName: 'Software Engineering',
    scoring_criteria: [
      {
        attribute: 'Integration of Multiple Disciplines',
        guidelines: {
          1: 'Disciplines are loosely connected or added on without a clear synergy.',
          3: 'Disciplines are integrated well, but the overlap could be more cohesive.',
          5: 'Disciplines are seamlessly interwoven, creating a solution that could not exist without the collaboration of all involved fields.',
        },
      },
      {
        attribute: 'Innovation in Multidisciplinary Problem-Solving',
        guidelines: {
          1: 'The project uses familiar approaches without any real blending of disciplines.',
          3: 'The project introduces some innovative combinations of disciplines but still relies on conventional methods.',
          5: 'The project demonstrates novel approaches by combining disciplines in ways that create unique and effective solutions.',
        },
      },
      {
        attribute: 'Knowledge Exchange and Domain Expertise',
        guidelines: {
          1: 'Limited sharing of domain knowledge between team members.',
          3: 'Good exchange of expertise with some cross-pollination of ideas.',
          5: 'Exceptional integration of different domain expertise, leading to innovative solutions.',
        },
      },
    ],
  },
  'Most Creative Hack': {
    name: 'Most Creative Hack',
    filter: 'General',
    prizes: ['Mini Projector'],
    images: [],
    eligibility_criteria:
      'Projects should demonstrate originality, showcase out-of-the-box thinking, and captivate its audience.',
    domain: 'business',
    domainDisplayName: 'Business',
    scoring_criteria: [
      {
        attribute: 'Originality and uniqueness of the concept',
        guidelines: {
          1: 'Common or derivative concept.',
          3: 'Some originality with unique elements.',
          5: 'Truly unique and original concept.',
        },
      },
      {
        attribute: 'Innovative problem-solving approach',
        guidelines: {
          1: 'Minimal innovation in solving problems.',
          3: 'Moderate innovation with creative solutions.',
          5: 'Highly innovative and groundbreaking solutions.',
        },
      },
      {
        attribute: 'Ability to surprise and engage the audience',
        guidelines: {
          1: 'Limited engagement or surprise.',
          3: 'Moderate engagement with some surprise elements.',
          5: 'Highly engaging and memorable experience.',
        },
      },
    ],
  },
  'Best Hack for Social Justice': {
    name: 'Best Hack for Social Justice',
    filter: 'General',
    prizes: ['Digital Camera'],
    images: [],
    eligibility_criteria:
      'Hack must address a social justice issue such as racial inequality, economic injustice, environmental justice, etc. This project should develop tangible solutions and/or raise awareness on these topics.',
    domain: 'swe',
    domainDisplayName: 'Software Engineering',
    scoring_criteria: [
      {
        attribute: 'Relevance and Clarity of Focus on Social Justice',
        guidelines: {
          1: 'Loosely connects to social justice themes, with unclear goals or outcomes.',
          3: 'Directly addresses a relevant social justice issue, but lacks depth in implementation.',
          5: 'Has a clear, focused approach to a significant social justice issue.',
        },
      },
      {
        attribute: 'Advocacy and Awareness Impact',
        guidelines: {
          1: 'Limited impact on raising awareness or advocacy.',
          3: 'Creates moderate awareness with some advocacy elements.',
          5: 'Effectively raises awareness and inspires action on social justice issues.',
        },
      },
      {
        attribute: 'Real-World Applicability and Impact',
        guidelines: {
          1: 'Solution is theoretical with minimal practical application.',
          3: 'Solution has practical potential but needs refinement.',
          5: 'Provides a realistic and actionable solution with clear potential for positive societal change.',
        },
      },
    ],
  },
  'Best Hardware Hack': {
    name: 'Best Hardware Hack',
    filter: 'Technical',
    prizes: ['TBA'],
    images: [],
    eligibility_criteria:
      'Effectively integrate a hardware component to your final project. The final project should be functional, user-friendly, and interactive.',
    domain: 'hardware',
    domainDisplayName: 'Hardware or Embedded Systems',
    scoring_criteria: [
      {
        attribute: 'Hardware Integration and Functionality',
        guidelines: {
          1: 'Hardware is either non-functional or not integrated meaningfully into the project.',
          3: 'Hardware works as intended but lacks refinement or advanced features.',
          5: "Hardware is expertly integrated, fully functional, and essential to the project's success.",
        },
      },
      {
        attribute: 'Creativity and Innovation in Hardware Design',
        guidelines: {
          1: 'Standard hardware design with minimal innovation.',
          3: 'Design incorporates some innovative features or a novel use of existing technology.',
          5: 'Highly innovative design that pushes boundaries of hardware capabilities.',
        },
      },
      {
        attribute: 'Usability and Interaction',
        guidelines: {
          1: "Difficult to use or doesn't provide a clear user experience.",
          3: 'Usable, but could benefit from design or interaction improvements.',
          5: 'Intuitive, user-friendly, and offers an exceptional user experience.',
        },
      },
    ],
  },
  'Most Technically Challenging Hack': {
    name: 'Most Technically Challenging Hack',
    filter: 'Technical',
    prizes: ['Dell S2425HS Monitor'],
    images: [],
    eligibility_criteria:
      'Projects must showcase breadth and application of technical knowledge. Focuses on use of advanced techical tools + algorithms/data structures, integration of multiple technologies, quality of implementation, displays technical depth, graded on performance/scalability',
    domain: 'swe',
    domainDisplayName: 'Software Engineering',
    scoring_criteria: [
      {
        attribute: 'Complexity of Problem Solved',
        guidelines: {
          1: 'Simple problem with straightforward implementation.',
          3: 'Moderately complex problem requiring significant technical skill.',
          5: 'Highly complex problem demanding advanced technical expertise.',
        },
      },
      {
        attribute: 'Technical Execution and Engineering',
        guidelines: {
          1: 'The technical implementation is incomplete or inefficient, with many flaws.',
          3: 'The technical execution is solid but could be more optimized or refined.',
          5: 'The project demonstrates flawless technical execution, with well-optimized, scalable solutions and robust engineering.',
        },
      },
      {
        attribute: 'Advanced Use of Technologies or Techniques',
        guidelines: {
          1: 'Uses basic or traditional technologies.',
          3: 'Uses a combination of standard and some advanced technologies.',
          5: 'Utilizes highly specialized or emerging technologies.',
        },
      },
      {
        attribute: 'Scalability and performance optimization',
        guidelines: {
          1: 'Minimal scalability with performance issues.',
          3: 'Moderate scalability with acceptable performance.',
          5: 'Highly scalable with optimized performance.',
        },
      },
    ],
  },
  'Best AI/ML Hack': {
    name: 'Best AI/ML Hack',
    filter: 'Technical',
    prizes: ['Claude API credits'],
    images: [],
    eligibility_criteria:
      'Project must have unique/creative AI functionality, clean data, accuracy in metrics, presence of high-quality data, utilizing relevant algorithms + ML libraries and/or cloud platforms for development. Participants should show how they collected their data and explain how their AI imitates the human mind. We encourage that models work accurately on unseen circumstances.',
    domain: 'aiml',
    domainDisplayName: 'Data Science or AI/ML',
    scoring_criteria: [
      {
        attribute: 'Innovative Use of AI/ML Techniques',
        guidelines: {
          1: 'Employs basic techniques or is an LLM wrapper.',
          3: 'Employs creative AI/ML techniques, but there is room for further exploration.',
          5: 'Demonstrates advanced and innovative AI/ML implementation.',
        },
      },
      {
        attribute: 'Model Performance and Accuracy',
        guidelines: {
          1: 'Poor model performance with significant accuracy issues.',
          3: 'Good performance with room for optimization.',
          5: 'Exceptional performance with robust accuracy across scenarios.',
        },
      },
      {
        attribute: 'Real-World Impact and Applicability',
        guidelines: {
          1: 'Limited practical application potential.',
          3: 'Clear practical use cases with implementation challenges.',
          5: 'Ready for real-world deployment with significant potential impact.',
        },
      },
    ],
  },
  'Best UI/UX Design': {
    name: 'Best UI/UX Design',
    filter: 'Design',
    prizes: ['Beats Studio Pro'],
    images: [],
    eligibility_criteria:
      'Project includes beautiful design and intuitive web experiences that bring joy to users. Shows that the project is not only functional but also delightful, demonstrates wireframing, responsive design and promots intuitive user experiences',
    domain: 'design',
    domainDisplayName: 'UI/UX Design',
    scoring_criteria: [
      {
        attribute: 'Aesthetic Appeal and Visual Consistency',
        guidelines: {
          1: 'Not attractive, inconsistent theme and style.',
          3: 'Moderately attractive, generally consistent style and theme.',
          5: 'Highly attractive and professional look, cohesive and consistent theme and style.',
        },
      },
      {
        attribute: 'Intuitive User Flow and Ease of Navigation',
        guidelines: {
          1: 'Difficult to navigate, confusing layout and poorly organized.',
          3: 'Generally intuitive navigation and layout with some areas for improvement.',
          5: 'Excellent, with superior navigation and highly intuitive layout.',
        },
      },
      {
        attribute: 'Inclusivity, Responsiveness and Accessibility',
        guidelines: {
          1: 'Not responsive or accessible, lacks consideration for varied users.',
          3: 'Moderately responsive and accessible.',
          5: 'Excellent responsiveness and accessibility, fully accommodates all users.',
        },
      },
    ],
  },
  'Best User Research': {
    name: 'Best User Research',
    filter: 'Design',
    prizes: ['6-month ChatGPT Pro subscription'],
    images: [],
    eligibility_criteria:
      'Awarded to a well-researched project that keeps its userbase in mind with an inclusive design aimed to maximize accessibility.',
    domain: 'design',
    domainDisplayName: 'UI/UX Design',
    scoring_criteria: [
      {
        attribute: 'Depth and quality of user research conducted',
        guidelines: {
          1: 'Minimal research with poor depth.',
          3: 'Moderate research with acceptable depth.',
          5: 'Thorough research with high depth and quality.',
        },
      },
      {
        attribute: 'Incorporation of User Feedback',
        guidelines: {
          1: 'Ineffective design that poorly supports functionality or user needs',
          3: 'Adequately supports functionality and mostly aligns with user needs.',
          5: 'Perfectly supports functionality, completely aligned with user needs and goals.',
        },
      },
      {
        attribute: 'Originality and Creativity in Meeting User Needs',
        guidelines: {
          1: 'Lacks creativity, very conventional, similar to other products in the market.',
          3: 'Moderately creative, noticeable innovative elements.',
          5: 'Highly innovative and unique, pushes boundaries.',
        },
      },
    ],
  },
  'Best Entrepreneurship Hack': {
    name: 'Best Entrepreneurship Hack',
    filter: 'Business',
    prizes: ['TBA'],
    images: [],
    eligibility_criteria:
      "No Code Required. A project that focuses on viability and persuasive power through presentation on the product/service you're trying to sell, relevant customer segments, distribution channels, and associated revenue/profit models.",
    domain: 'business',
    domainDisplayName: 'Business',
    scoring_criteria: [
      {
        attribute: 'Viability and feasibility of the business model',
        guidelines: {
          1: 'Unviable or unrealistic model.',
          3: 'Moderately viable with some feasibility.',
          5: 'Highly viable and feasible business model.',
        },
      },
      {
        attribute: 'Clarity and persuasiveness of the pitch',
        guidelines: {
          1: 'Unclear and unconvincing pitch.',
          3: 'Moderately clear with some persuasion.',
          5: 'Highly persuasive and clear pitch.',
        },
      },
      {
        attribute: 'Identification of target market and revenue streams',
        guidelines: {
          1: 'Minimal understanding of the market.',
          3: 'Moderate understanding with some insights.',
          5: 'Comprehensive market understanding with clear revenue streams.',
        },
      },
    ],
  },
  'Best Statistical Model': {
    name: 'Best Statistical Model',
    filter: 'Technical',
    prizes: ['Power BI Pro'],
    images: [],
    eligibility_criteria:
      'Projects must seamlessly incorporate significance tests that evaluate a hypothesis based on their primary question or project goal, with an emphasis on accuracy metrics such as MSE, R^2, adjusted R^2, precision and recall.',
    domain: 'aiml',
    domainDisplayName: 'Data Science or AI/ML',
    scoring_criteria: [
      {
        attribute: 'Accuracy and reliability of the statistical model',
        guidelines: {
          1: 'Low accuracy with unreliable results.',
          3: 'Moderate accuracy with some reliable outcomes.',
          5: 'High accuracy with consistently reliable results.',
        },
      },
      {
        attribute: 'Appropriate use of significance tests and metrics',
        guidelines: {
          1: 'Inappropriate or minimal use of metrics.',
          3: 'Moderate use with partially relevant metrics.',
          5: 'Excellent use with highly relevant metrics.',
        },
      },
      {
        attribute: "Interpretability and clarity of the model's output",
        guidelines: {
          1: 'Difficult to interpret or unclear.',
          3: 'Moderately clear with some interpretability.',
          5: 'Highly interpretable and clearly presented.',
        },
      },
    ],
  },
  'Best Medtech Hack': {
    name: 'Best MedTech Hack',
    filter: 'Technical',
    prizes: ['TBA'],
    images: [],
    eligibility_criteria: 'TBA',
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
  ...categorizedTracks,
  ...uncategorizedTracks,
};

const displayNameToDomainMap: Map<string, string> = new Map(
  Object.entries(categorizedTracks).map(([_, value]) => [
    value.domainDisplayName ?? '',
    value.domain ?? '',
  ])
);

export {
  allTracks,
  categorizedTracks,
  uncategorizedTracks,
  displayNameToDomainMap,
};
export const bestHackForSocialGood =
  uncategorizedTracks['Best Hack for Social Good'];
export type { TrackData, Tracks };
