'use client';

import DesignResources from './DesignResources';
import DevResources from './DevResources';
import Ideate from './Ideate/Ideate';
import Introduction from './Introduction';
import MoreTips from './MoreTips';
import TeamBuilding from './TeamBuilding';

const sections = [
  {
    title: 'Introduction',
    id: 'starter-kit-introduction',
    Component: Introduction,
  },
  {
    title: 'Team Building',
    id: 'starter-kit-team-building',
    Component: TeamBuilding,
  },
  {
    title: 'Ideate',
    id: 'starter-kit-ideate',
    Component: Ideate,
  },
  {
    title: 'Design Resources',
    id: 'starter-kit-design-resources',
    Component: DesignResources,
  },
  {
    title: 'Dev Resources',
    id: 'starter-kit-dev-resources',
    Component: DevResources,
  },
  {
    title: 'More Tips',
    id: 'starter-kit-more-tips',
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
      <div className="hidden md:flex px-[20px] mt-[100px] gap-[30px] flex-col">
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
