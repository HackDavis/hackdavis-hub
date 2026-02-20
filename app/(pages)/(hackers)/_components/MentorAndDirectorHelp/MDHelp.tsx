import { Card } from './MDHelpCards';

// Items for Mapping
const items = [
  {
    title: 'Mentor Help',
    description:
      'Stuck on a problem and need guidance? Contact a HackDavis mentor through our discord.',
    image: '/components/MDHelp/cow.svg',
    link: 'https://discord.gg/wc6QQEc',
    linkName: 'CONTACT A MENTOR',
  },
  {
    title: 'Director Help',
    description:
      'Got questions about this event? Contact a HackDavis director through our discord.',
    image: '/components/MDHelp/duck.svg',
    link: 'https://discord.gg/wc6QQEc',
    linkName: 'CONTACT A DIRECTOR',
  },
];

export default function cardTest() {
  return (
    <div className="flex bg-[#FAFAFF]">
      {/* Main Content */}
      <main className="flex px-[5%] py-[10%] w-full">
        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full 2xl:flex items-center">
          {items.map((item, index) => (
            <Card
              key={index}
              image={item.image}
              title={item.title}
              description={item.description}
              link={item.link}
              linkName={item.linkName}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
