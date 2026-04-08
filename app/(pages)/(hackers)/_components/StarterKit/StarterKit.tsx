'use client';

import DesignDevResources from './Resources/DesignDevResources';
import Ideate from './Ideate/Ideate';
import Introduction from './Introduction';
import MoreTips from './MoreTips';
import TeamBuilding from './TeamBuilding';

const sections = [
  {
    title: 'Introduction',
    id: 'introduction',
    Component: Introduction,
  },
  {
    title: 'Team Building',
    id: 'team-building',
    Component: TeamBuilding,
  },
  {
    title: 'Ideate',
    id: 'ideate',
    Component: Ideate,
  },
  {
    title: 'Design Resources',
    id: 'design-resources',
    Component: DesignDevResources,
  },
  {
    title: 'Dev Resources',
    id: 'dev-resources',
    Component: DesignDevResources,
  },
  {
    title: 'More Tips',
    id: 'more-tips',
    Component: MoreTips,
  },
];

function scrollToSection(id: string) {
  const element = document.getElementById(id);
  if (!element) return;
  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function StarterKit() {
  return (
    <div className="flex flex-row">
      <div className="hidden md:flex px-[20px] mt-[100px] gap-[30px] flex-col sticky top-[100px] self-start">
        {sections.map((section) => (
          <button
            key={section.id}
            type="button"
            onClick={() => scrollToSection(section.id)}
            className="font-dm-mono text-[16px] text-[#ACACB9] uppercase text-left"
          >
            {section.title}
          </button>
        ))}
      </div>
      <div>
        {sections.map(({ id, Component }) => (
          <section key={id} id={id} className="scroll-mt-[100px]">
            <Component />
          </section>
        ))}
      </div>
    </div>
  );
}
