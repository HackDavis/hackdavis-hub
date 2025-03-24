export interface Prize {
  category: string;
  tracks: string;
  prize: string;
  image: string;
}

// putting this here in case we want to move it to db which means
// we will have to call on the backend

export const prizes: Prize[] = [
  {
    category: 'General',
    tracks: 'Best Hack for Social Good - 1st Place',
    prize: 'iPads',
    image: '/index/schedule/location.svg',
  },
  {
    category: 'General',
    tracks: 'Best Hack for Social Good - 2nd Place',
    prize: 'Meta Quest',
    image: '/index/schedule/location.svg',
  },
  {
    category: 'General',
    tracks: 'Best Beginner Hack',
    prize: 'Hugging Face Subscription (pro account 13 month subscription)',
    image: '/index/schedule/location.svg',
  },
  {
    category: 'General',
    tracks: 'Best Interdisciplinary Hack',
    prize: '3D Printing pen + Extra Filament',
    image: '/index/schedule/location.svg',
  },
  {
    category: 'General',
    tracks: "Hacker's Choice Award",
    prize: 'HackDavis Swag Bag (Tote, Stickers, Keychains)',
    image: '/index/schedule/location.svg',
  },
  {
    category: 'General',
    tracks: 'Best Hack for Social Justice',
    prize: 'Digital Camera (on sale)',
    image: '/index/schedule/location.svg',
  },
  {
    category: 'General',
    tracks: 'Most Creative Hack',
    prize: 'Mini Projector',
    image: '/index/schedule/location.svg',
  },
  {
    category: 'Tech',
    tracks: 'Best Hardware Hack',
    prize: 'Raspberry Pi',
    image: '/index/schedule/location.svg',
  },
  {
    category: 'Tech',
    tracks: 'Most Technically Challenging Hack',
    prize: 'Computer monitors',
    image: '/index/schedule/location.svg',
  },
  {
    category: 'Design',
    tracks: 'Best UI/UX Design',
    prize:
      'Beats Studio Pros ($179 on sale) / Digital drawing tablet? Some design platform subscription',
    image: '/index/schedule/location.svg',
  },
  {
    category: 'Design',
    tracks: 'Best User Research',
    prize: '6-month ChatGPT Pro subscription',
    image: '/index/schedule/location.svg',
  },
  {
    category: 'Design',
    tracks: 'Best Interactive Media Hack',
    prize: '',
    image: '/index/schedule/location.svg',
  },
  {
    category: 'Design',
    tracks: 'Best Finance + Tech',
    prize: '',
    image: '/index/schedule/location.svg',
  },
  {
    category: 'Business/Stats',
    tracks: 'Best Entrepreneurship Hack',
    prize: 'Squarespace/Wix',
    image: '/index/schedule/location.svg',
  },
  {
    category: 'Business/Stats',
    tracks: 'Best Statistical Model',
    prize: 'Power BI Pro',
    image: '/index/schedule/location.svg',
  },
  {
    category: 'NPOs',
    tracks: 'California GovOps',
    prize: 'Plushies (goose)',
    image: '/index/schedule/location.svg',
  },
  {
    category: 'NPOs',
    tracks: 'Yolo Nami',
    prize: 'Plushies',
    image: '/index/schedule/location.svg',
  },
  {
    category: 'NPOs',
    tracks: 'npo_name - npo_goal/description',
    prize: 'Plushies',
    image: '/index/schedule/location.svg',
  },
  {
    category: 'Companies / School Depts',
    tracks: 'Cerebras Custom Track',
    prize: '',
    image: '/index/schedule/location.svg',
  },
  {
    category: 'Companies / School Depts',
    tracks: 'Open Data Hack (Sponsored by DataLab)',
    prize: 'Datalab internship',
    image: '/index/schedule/location.svg',
  },
  {
    category: 'Companies / School Depts',
    tracks: 'Best Medtech Hack (Sponsored by UCDMedTechClub)',
    prize: 'Stethoscope? T~T',
    image: '/index/schedule/location.svg',
  },
  {
    category: 'Companies / School Depts',
    tracks: 'Best AI/ML Hack (Sponsored by Anthropic)',
    prize: 'Claude API credits',
    image: '/index/schedule/location.svg',
  },
];
