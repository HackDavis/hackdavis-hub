import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import ipad from '@public/prizes/ipad.png';
import jblSpeaker from '@public/prizes/jbl_speaker.png';
import huggingFaceIcon from '@public/prizes/hugging_face_icon.svg';
import threeDPen from '@public/prizes/3d_pen.png';
import projector from '@public/prizes/projector.png';
import camera from '@public/prizes/4k_camera.png';
import headphones from '@public/prizes/beats_headphone.png';
import catPlushie from '@public/prizes/cute_cat_plushies.png';
import duckPlushie from '@public/prizes/giant_duck.png';
import monitor from '@public/prizes/monitor.png';
import raspberryPi from '@public/prizes/raspberry_pi.jpg';
import defaultIcon from '@public/icons/icon.ico';

export interface Prize {
  category: string;
  track: string;
  prizes: string[];
  images: StaticImport[];
  eligability_criteria: string;
}

export const prizes: Prize[] = [
  {
    category: 'General',
    track: 'Best Hack for Social Good',
    prizes: ['IPad', 'JBL Charge 5'],
    images: [ipad, jblSpeaker],
    eligability_criteria:
      'Encapsulate your authentic idea of "social good". All entries are automatically considered for this prize category.',
  },
  {
    category: 'General',
    track: 'Best Beginner Hack',
    prizes: ['13-month Hugging Face Pro Subscription'],
    images: [huggingFaceIcon],
    eligability_criteria:
      'Every team member must be a first-time hacker in order to qualify. Demonstrate a high level of growth through this project. Foster creativity and collaboration within the team and display a committment to building skills.',
  },
  {
    category: 'General',
    track: 'Best Interdisciplinary Hack',
    prizes: ['3D Printing Pen'],
    images: [threeDPen],
    eligability_criteria:
      'Leverage multiple perspectives across different disciplines to create a more well-rounded project. At least one member of the team needs to be a non-CS/CSE/otherwise CS-related major in order to qualify.',
  },
  {
    category: 'General',
    track: 'Most Creative Hack',
    prizes: ['Mini Projector'],
    images: [projector],
    eligability_criteria:
      'Projects should demonstrate originality, showcase out-of-the-box thinking, and captivate its audience.',
  },
  {
    category: 'General',
    track: 'Best Hack for Social Justice',
    prizes: ['Digital Camera'],
    images: [camera],
    eligability_criteria:
      'Hack must address a social justice issue such as racial inequality, economic injustice, environmental justice, etc. This project should develop tangible solutions and/or raise awareness on these topics.',
  },
  {
    category: 'Technical',
    track: 'Best Hardware Hack',
    prizes: ['TBA'],
    images: [raspberryPi],
    eligability_criteria:
      'Effectively integrate a hardware component to your final project. The final project should be functional, user-friendly, and interactive.',
  },
  {
    category: 'Technical',
    track: 'Most Technically Challenging Hack',
    prizes: ['Dell S2425HS Monitor'],
    images: [monitor],
    eligability_criteria:
      'Projects must showcase breadth and application of technical knowledge. Focuses on use of advanced techical tools + algorithms/data structures, integration of multiple technologies, quality of implementation, displays technical depth, graded on performance/scalability',
  },
  {
    category: 'Technical',
    track: 'Best Open Data Hack',
    prizes: ['Luncheon and internship program invite', '2nd Place: Swag bags'],
    images: [defaultIcon, defaultIcon],
    eligability_criteria:
      'Projects must use at least one publicly accessible dataset that relates to UC Davis to address questions of interest to our campus community. For consideration for this award, the team must produce a GitHub repository with a readME, annotated code, and a reproducible static data visualization. The visualization should have an accompanying 1-page narrative describing the goals, methods, and interpretation of the project.',
  },
  {
    category: 'Technical',
    track: 'Best AI/ML Hack',
    prizes: ['Claude API credits'],
    images: [defaultIcon],
    eligability_criteria:
      'Project must have unique/creative AI functionality, clean data, accuracy in metrics, presence of high-quality data, utilizing relevant algorithms + ML libraries and/or cloud platforms for development. Participants should show how they collected their data and explain how their AI imitates the human mind. We encourage that models work accurately on unseen circumstances.',
  },
  {
    category: 'Design',
    track: 'Best UI/UX Design',
    prizes: ['Beats Studio Pro'],
    images: [headphones],
    eligability_criteria:
      'Project includes beautiful design and intuitive web experiences that bring joy to users. Shows that the project is not only functional but also delightful, demonstrates wireframing, responsive design and promots intuitive user experiences',
  },
  {
    category: 'Design',
    track: 'Best User Research',
    prizes: ['6-month ChatGPT Pro subscription'],
    images: [defaultIcon],
    eligability_criteria:
      'Awarded to a well-researched project that keeps its userbase in mind with an inclusive design aimed to maximize accessibility.',
  },
  {
    category: 'Technical',
    track: 'Best Statistical Model',
    prizes: ['Power BI Pro'],
    images: [defaultIcon],
    eligability_criteria:
      'Projects must seamlessly incorporate significance tests that evaluate a hypothesis based on their primary question or project goal, with an emphasis on accuracy metrics such as MSE, R^2, adjusted R^2, precision and recall.',
  },
  {
    category: 'Technical',
    track: 'Best MedTech Hack',
    prizes: ['TBA'],
    images: [defaultIcon],
    eligability_criteria: 'TBA',
  },
  {
    category: 'Business',
    track: 'Best Entrepreneurship Hack',
    prizes: ['TBA'],
    images: [defaultIcon],
    eligability_criteria:
      "No Code Required. A project that focuses on viability and persuasive power through presentation on the product/service you're trying to sell, relevant customer segments, distribution channels, and associated revenue/profit models.",
  },
  {
    category: 'General',
    track: "Hacker's Choice Award",
    prizes: ['HackDavis Swag Bag'],
    images: [defaultIcon],
    eligability_criteria:
      'Awarded to the project with the most votes from our 2025 hackers. Vote for any project but your own!',
  },
  {
    category: 'Nonprofit',
    track: 'Best Hack for California GovOps Agency',
    prizes: ['1 Plushie'],
    images: [duckPlushie],
    eligability_criteria: 'TBA',
  },
  {
    category: 'Nonprofit',
    track: 'Best Hack for NAMI Yolo',
    prizes: ['1 Plushie'],
    images: [catPlushie],
    eligability_criteria:
      'NAMI Yolo provides free mental health support and resources in Yolo County and heavily relies on trained volunteers. Implement a centralized volunteer management system that provides an intuitive interface for tracking volunteer activity, training history, and scheduling',
  },
  {
    category: 'Nonprofit',
    track: 'Best Hack for Fourth and Hope',
    prizes: ['1 Plushie'],
    images: [catPlushie],
    eligability_criteria:
      'Fourth & Hope provides essential services to individuals experiencing homelessness and housing insecurity, including meals, showers, shelter beds, etc. Build a secure and user-friendly digital intake and service-tracking system to enhance service coordination and data management',
  },
  {
    category: 'Technical',
    track: 'Best Use of Cerebras API',
    prizes: ['TBA'],
    images: [defaultIcon],
    eligability_criteria: '',
  },
];
