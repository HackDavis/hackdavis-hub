import Image from 'next/image';
import impactImage from '@public/hackers/starter-kit/ideate/Impact.svg';
import audienceImage from '@public/hackers/starter-kit/ideate/Audience.svg';
import apartImage from '@public/hackers/starter-kit/ideate/Apart.svg';
import IdeateInfoCard from './IdeateInfoCard';
import IdeateSection from './IdeateSection';

const principles = [
  {
    title: 'Impact Level',
    description:
      'Does your product solve a real problem? Strong projects are rooted in something people actually need help with!',
    visual: (
      <Image
        src={impactImage}
        alt="Impact level illustration"
        className="h-full w-full object-cover"
      />
    ),
  },
  {
    title: 'Tailor for Audience',
    description:
      'Who are your users? What are their pain points? Know who you’re building for. The clearer your user is, the easier it is to make smart product decisions.',
    visual: (
      <Image
        src={audienceImage}
        alt="Audience illustration"
        className="h-full w-full object-cover"
      />
    ),
  },
  {
    title: 'Set Yourself Apart',
    description:
      'What makes your solution unique? Find your twist. Your project does not need to be huge, but it should have something that makes people remember it.',
    visual: (
      <Image
        src={apartImage}
        alt="Set yourself apart illustration"
        className="h-full w-full object-cover"
      />
    ),
  },
];

export default function IdeatePrinciples() {
  return (
    <IdeateSection eyebrow="While Brainstorming" title="Keep these in mind...">
      <div className="grid gap-10 md:grid-cols-3 md:gap-6">
        {principles.map((principle) => (
          <IdeateInfoCard key={principle.title} {...principle} />
        ))}
      </div>
    </IdeateSection>
  );
}
