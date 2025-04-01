export interface Prize {
  category: string;
  tracks: string;
  prize: string;
  additionalPrize?: string;
  image: string;
  additionalPrizeImage?: string;
  eligability_criteria: string;
}

// putting this here in case we want to move it to db which means
// we will have to call on the backend

export const prizes: Prize[] = [
  {
    category: 'General',
    tracks: 'Best Hack for Social Good - 1st Place',
    prize: 'iPads',
    additionalPrize: 'Meta Quest',
    image: '/prizes/ipad.jpg',
    additionalPrizeImage: '/prizes/hugging_face_icon.svg',
    eligability_criteria:
      'Encapsulate your authentic idea of "social good" can look like. All entries are automatically considered for this prize category.',
  },
  {
    category: 'General',
    tracks: 'Best Beginner Hack',
    prize: 'Hugging Face Subscription (pro account 13 month subscription)',
    image: '/prizes/hugging_face_icon.svg',
    eligability_criteria:
      'Every team member must be a beginner in order to qualify. Demonstrate a high level of growth through this project. Foster creativity and collaboration within the team and display a committment to building skills.',
  },
  {
    category: 'General',
    tracks: 'Best Interdisciplinary Hack',
    prize: '3D Printing pen + Extra Filament',
    image: '/prizes/3d_pen.jpg',
    eligability_criteria:
      'Leverage multiple perspectives across different disciplines to create a more well-rounded project. At least one member of the team needs to be a non-CS/CSE/otherwise CS-related major in order to qualify.',
  },
  {
    category: 'General',
    tracks: "Hacker's Choice Award",
    prize: 'HackDavis Swag Bag (Tote, Stickers, Keychains)',
    image: '/prizes/hugging_face_icon.svg',
    eligability_criteria:
      'Awarded to the project with the most votes from our 2024 hackers. Vote for any project but your own!',
  },
  {
    category: 'General',
    tracks: 'Best Hack for Social Justice',
    prize: 'Digital Camera',
    image: '/prizes/4k_camera.jpg',
    eligability_criteria:
      'Hack must address a social justice issue such as racial inequality, economic injustice, environmental justice, etc. This project should develop tangible solutions and/or raise awareness on these topics.',
  },
  {
    category: 'General',
    tracks: 'Most Creative Hack',
    prize: 'Mini Projector',
    image: '/prizes/projector.jpg',
    eligability_criteria:
      'The Most Creative Hack should demonstrate originality, showcase out-of-the-box thinking, and captivate its audience.',
  },
  {
    category: 'Technical',
    tracks: 'Best Hardware Hack',
    prize: 'Raspberry Pi',
    image: '/prizes/raspberry_pi.jpg',
    eligability_criteria:
      'Effectively integrate a hardware component to your final project. The final project should be functional, user-friendly, and interactive.',
  },
  {
    category: 'Technical',
    tracks: 'Most Technically Challenging Hack',
    prize: 'Computer monitors',
    image: '/prizes/monitor.jpg',
    eligability_criteria:
      'Projects must showcase breadth and application of technical knowledge. Focuses on use of advanced techical tools + algorithms/data structures, integration of multiple technologies, quality of implementation, displays technical depth, graded on performance/scalability',
  },
  {
    category: 'Design',
    tracks: 'Best UI/UX Design',
    prize:
      'Beats Studio Pros ($179 on sale) / Digital drawing tablet? Some design platform subscription',
    image: '/prizes/beats_headphone.jpg',
    eligability_criteria:
      'Project includes beautiful design and intuitive web experiences that bring joy to users. Shows that the project is not only functional but also delightful, demonstrates wireframing, responsive design and promots intuitive user experiences',
  },
  {
    category: 'Design',
    tracks: 'Best User Research',
    prize: '6-month ChatGPT Pro subscription',
    image: '/prizes/hugging_face_icon.svg',
    eligability_criteria:
      'Awarded to a well-researched project that keeps its userbase in mind with an inclusive design aimed to maximize accessibility.',
  },
  {
    category: 'Design',
    tracks: 'Best Interactive Media Hack',
    prize: '',
    image: '/prizes/hugging_face_icon.svg',
    eligability_criteria:
      'No Code Required. Get creative with relevant media to push the boundaries of interactive technologies today. Project focus should be on the user experience being as interactive as possible, potentially a gamified platform, an AI education platform, or an interactive concert viewing. A perfect opportunity to tap into non-tech skills, perhaps by incorporating music, visuals, and any other creative methods that come to mind.',
  },
  {
    category: 'Design',
    tracks: 'Best Finance + Tech',
    prize: '',
    image: '/prizes/hugging_face_icon.svg',
    eligability_criteria:
      'Simpler and more mainstream code like Python are encouraged but not required. Teams should aim to develop innovative fintech solutions with practical functionalities, oriented towards addressing a social issue that would benefit from a more effective user framework.',
  },
  {
    category: 'Business',
    tracks: 'Best Entrepreneurship Hack',
    prize: 'Squarespace/Wix',
    image: '/prizes/hugging_face_icon.svg',
    eligability_criteria:
      "No Code Required. A project that focuses on viability and persuasive power through presentation on the product/service you're trying to sell, relevant customer segments, distribution channels, and associated revenue/profit models.",
  },
  {
    category: 'Business',
    tracks: 'Best Statistical Model',
    prize: 'Power BI Pro',
    image: '/prizes/hugging_face_icon.svg',
    eligability_criteria:
      'Projects must seamlessly incorporate significance tests that evaluate a hypothesis based on their primary question or project goal, with an emphasis on accuracy metrics such as MSE, R^2, adjusted R^2, precision and recall. Various statistical models such as',
  },
  {
    category: 'Nonprofit',
    tracks: 'California GovOps',
    prize: 'Plushies (goose)',
    image: '/prizes/giant_duck.jpg',
    eligability_criteria: '',
  },
  {
    category: 'Nonprofit',
    tracks: 'Yolo Nami',
    prize: 'Plushies',
    image: '/prizes/cute_cat_plushies.jpg',
    eligability_criteria: '',
  },
  {
    category: 'Nonprofit',
    tracks: 'npo_name - npo_goal/description',
    prize: 'Plushies',
    image: '/prizes/hugging_face_icon.svg',
    eligability_criteria: '',
  },
  {
    category: 'Technical',
    tracks: 'Cerebras Custom Track',
    prize: '',
    image: '/prizes/hugging_face_icon.svg',
    eligability_criteria: '',
  },
  {
    category: 'Technical',
    tracks: 'Open Data Hack (Sponsored by DataLab)',
    prize: 'Datalab internship',
    image: '/prizes/hugging_face_icon.svg',
    eligability_criteria: '',
  },
  {
    category: 'Technical',
    tracks: 'Best Medtech Hack (Sponsored by UCDMedTechClub)',
    prize: 'Stethoscope? T~T',
    image: '/prizes/hugging_face_icon.svg',
    eligability_criteria: '',
  },
  {
    category: 'Technical',
    tracks: 'Best AI/ML Hack (Sponsored by Anthropic)',
    prize: 'Claude API credits',
    image: '/prizes/hugging_face_icon.svg',
    eligability_criteria: '',
  },
];
