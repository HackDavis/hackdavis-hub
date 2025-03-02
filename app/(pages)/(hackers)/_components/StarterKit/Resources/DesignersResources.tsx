import ResourceCard from './resource_card';

const designerResources = [
  {
    name: 'Human-Centered Design Process',
    url: 'https://www.usertesting.com/blog/how-ideo-uses-customer-insights-to-design-innovative-products-users-love',
  },
  {
    name: 'Figma for Beginners',
    url: 'https://www.youtube.com/playlist?list=PLXDU_eVOJTx7QHLShNqIXL1Cgbxj7HlN4',
  },
  {
    name: 'Design Features in Figma',
    url: 'https://youtube.com/playlist?list=PLXDU_eVOJTx6zk5MDarIs0asNoZqlRG23',
  },
  {
    name: 'Figma End to End',
    url: 'https://www.figma.com/resources/learn/getting-started-figma-end-to-end/',
  },
  {
    name: 'Tips for presentations (Figma)',
    url: 'https://youtu.be/yPuuiz1kT1M',
  },
  {
    name: 'Building Reusable Components',
    url: 'https://youtu.be/k8y9SRPB78Q',
  },
  {
    name: 'Prototyping & Transitions',
    url: 'https://youtu.be/-d6zNGeF59M',
  },
  {
    name: 'Anatomy of a design pitch',
    url: 'https://uxdesign.cc/anatomy-of-a-design-pitch-17435f3e7e0f',
  },
  {
    name: 'Human-Centered Design',
    url: 'https://www.designkit.org/human-centered-design',
  },
];

export default function DesignersResources() {
  return (
    <main className="relative h-[560px] flex flex-col items-center bg-[#123041] p-4 md:p-8 lg:p-12 rounded-xl overflow-hidden">
      <div className="w-full max-h-full overflow-y-auto pr-2 md:pr-3 lg:pr-4 pb-4 md:pb-5 lg:pb-6 custom-scrollbar">
        <div className="flex flex-col gap-4 md:gap-5 lg:gap-6 items-center">
          {designerResources.map((resource) => (
            <ResourceCard key={resource.name} resource={resource} />
          ))}
        </div>
      </div>
    </main>
  );
}
