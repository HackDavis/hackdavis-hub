import { Card } from './MDHelpCards';

// Items for Mapping
const items = [
  {
    title: 'Mentor Help',
    description:
      'Get our announcements updates in our discord and instagram blah blah blah blah blah.',
    image: '/components/MDHelp/cow.svg',
    link: '#',
    linkName: 'CONTACT A MENTOR',
  },
  {
    title: 'Director Help',
    description:
      'Get our announcements updates in our discord and instagram blah blah blah blah blah.',
    image: '/components/MDHelp/duck.svg',
    link: '#',
    linkName: 'CONTACT A DIRECTOR',
  },
];

export default function cardTest() {
  return (
    <div className="flex justify-center  bg-[#FAFAFF]">
      {/* Main Content */}
      <main className="flex justify-center px-8 py-12">
        {/* Items Grid */}
        <div className="grid grid-row-2 gap-10 2xl:flex">
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
