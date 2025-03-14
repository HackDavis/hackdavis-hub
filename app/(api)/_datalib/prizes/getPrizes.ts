interface Prize {
  category: string;
  tracks: string;
  prize: string;
}

// putting this here in case we want to move it to db which means
// we will have to call on the backend

export const prizes: Prize[] = [
  {
    category: 'General',
    tracks: 'Best Hack for Social Good - 1st Place',
    prize: 'iPads',
  },
  {
    category: 'General',
    tracks: 'Best Hack for Social Good - 2nd Place',
    prize: 'Meta Quest',
  },
  {
    category: 'General',
    tracks: 'Best Beginner Hack',
    prize: 'Hugging Face Subscription (pro account 13 month subscription)',
  },
  {
    category: 'General',
    tracks: 'Best Interdisciplinary Hack',
    prize: '3D Printing pen + Extra Filament',
  },
  {
    category: 'General',
    tracks: "Hacker's Choice Award",
    prize: 'HackDavis Swag Bag (Tote, Stickers, Keychains)',
  },
  {
    category: 'General',
    tracks: 'Best Hack for Social Justice',
    prize: 'Digital Camera (on sale)',
  },
  {
    category: 'General',
    tracks: 'Most Creative Hack',
    prize: 'Mini Projector',
  },
  {
    category: 'Tech',
    tracks: 'Best Hardware Hack',
    prize: 'Raspberry Pi',
  },
  {
    category: 'Tech',
    tracks: 'Most Technically Challenging Hack',
    prize: 'Computer monitors',
  },
  {
    category: 'Design',
    tracks: 'Best UI/UX Design',
    prize:
      'Beats Studio Pros ($179 on sale) / Digital drawing tablet? Some design platform subscription',
  },
  {
    category: 'Design',
    tracks: 'Best User Research',
    prize: '6-month ChatGPT Pro subscription',
  },
  {
    category: 'Design',
    tracks: 'Best Interactive Media Hack',
    prize: '',
  },
  {
    category: 'Design',
    tracks: 'Best Finance + Tech',
    prize: '',
  },
  {
    category: 'Business/Stats',
    tracks: 'Best Entrepreneurship Hack',
    prize: 'Squarespace/Wix',
  },
  {
    category: 'Business/Stats',
    tracks: 'Best Statistical Model',
    prize: 'Power BI Pro',
  },
  {
    category: 'NPOs',
    tracks: 'California GovOps',
    prize: 'Plushies (goose)',
  },
  {
    category: 'NPOs',
    tracks: 'Yolo Nami',
    prize: 'Plushies',
  },
  {
    category: 'NPOs',
    tracks: 'npo_name - npo_goal/description',
    prize: 'Plushies',
  },
  {
    category: 'Companies / School Depts',
    tracks: 'Cerebras Custom Track',
    prize: '',
  },
  {
    category: 'Companies / School Depts',
    tracks: 'Open Data Hack (Sponsored by DataLab)',
    prize: 'Datalab internship',
  },
  {
    category: 'Companies / School Depts',
    tracks: 'Best Medtech Hack (Sponsored by UCDMedTechClub)',
    prize: 'Stethoscope? T~T',
  },
  {
    category: 'Companies / School Depts',
    tracks: 'Best AI/ML Hack (Sponsored by Anthropic)',
    prize: 'Claude API credits',
  },
];
