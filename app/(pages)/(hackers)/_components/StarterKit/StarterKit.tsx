'use client';

import { useEffect, useState } from 'react';
import DesignDevResources from './Resources/DesignDevResources';
import Ideate from './Ideate/Ideate';
import Introduction from './Introduction';
import MoreTips from './MoreTips';
import TeamBuilding from './TeamBuilding';

const sections = [
  { title: 'Introduction', id: 'introduction', Component: Introduction },
  { title: 'Team Building', id: 'team-building', Component: TeamBuilding },
  { title: 'Ideate', id: 'ideate', Component: Ideate },
  {
    title: 'Design Resources',
    id: 'design-resources',
    Component: DesignDevResources,
  },
  { title: 'More Tips', id: 'more-tips', Component: MoreTips },
];

const designResourceLinks = [
  { title: 'Design Resources', id: 'design-resources' },
  { title: 'Dev Resources', id: 'dev-resources' },
];

function scrollToSection(id: string) {
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function StarterKit() {
  const [activeId, setActiveId] = useState<string>('introduction');

  useEffect(() => {
    const handleScroll = () => {
      const sectionIds = [...sections.map((s) => s.id)];

      // If we're at the bottom of the page, highlight the last section
      if (
        window.innerHeight + window.scrollY >=
        document.body.scrollHeight - 10
      ) {
        setActiveId('more-tips');
        return;
      }

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;

        const { top } = el.getBoundingClientRect();
        if (top <= 150) setActiveId(id);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (id: string) => activeId === id;

  const buttonClass = (id: string) =>
    `font-dm-mono text-[16px] uppercase text-left transition-colors duration-200 relative pl-4
     before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1.5 before:h-1.5 before:rounded-full
     before:transition-all before:duration-200
     ${
       isActive(id)
         ? 'text-black before:bg-[#3F3F3F] before:opacity-100'
         : 'text-[#ACACB9] before:opacity-0'
     }`;

  return (
    <div className="flex flex-row">
      <div className="hidden md:flex px-[20px] mt-[100px] gap-[30px] flex-col sticky top-[100px] self-start">
        {sections.map((section) =>
          // Render separate link for Design and Dev Resources in sidebar
          section.id === 'design-resources' ? (
            designResourceLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => scrollToSection(link.id)}
                className={buttonClass(link.id)}
              >
                {link.title}
              </button>
            ))
          ) : (
            <button
              key={section.id}
              type="button"
              onClick={() => scrollToSection(section.id)}
              className={buttonClass(section.id)}
            >
              {section.title}
            </button>
          )
        )}
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
