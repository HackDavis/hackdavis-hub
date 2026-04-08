import patientSimImage from '@public/hackers/starter-kit/ideate/patient_sim_ai.png';
import nomadImage from '@public/hackers/starter-kit/ideate/nomad.png';
import skinScreenImage from '@public/hackers/starter-kit/ideate/SkinScreen.png';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '@globals/components/ui/button';
import IdeateSection from './IdeateSection';
import WinningHackCard from './WinningHackCard';

const devPostLink = 'https://hackdavis-2024.devpost.com/project-gallery';

const winningHacks = [
  {
    award: 'Best Hack for Social Good',
    year: '2024',
    title: 'PatientSimAI',
    description:
      'PatientSimAI is a web app using AI and GPT-4 to simulate patient interactions, aiding clinical training, enhancing medical education, and building practical skills.',
    link: 'https://devpost.com/software/patientsimai',
    image: patientSimImage,
  },
  {
    award: 'Best Hack for Social Good',
    year: '2024',
    title: 'nomad /\\',
    description:
      'Users can place pins for homeless individuals or lost animals, alerting organizations to assist. The app also encourages donations, volunteering, and offers local business rewards.',
    link: 'https://devpost.com/software/nomad-xmlf65',
    image: nomadImage,
  },
  {
    award: 'Best Health Hack',
    year: '2023',
    title: 'SkinScreen',
    description:
      'SkinScreen is a mobile app that uses deep learning to analyze photos of skin lesions and identify potential skin conditions, helping users detect possible skin cancer early and access educational resources for better skin health.',
    link: devPostLink,
    image: skinScreenImage,
  },
];

export default function IdeateWinningHacks() {
  return (
    <IdeateSection
      eyebrow=""
      title="Previous winning hacks"
      action={
        <Button
          asChild
          variant="default"
          className="h-11 rounded-full border-0 bg-[#3c3b3a] px-5 text-sm font-semibold text-white shadow-none hover:bg-[#2f2e2d] md:px-6"
        >
          <a href={devPostLink} target="_blank" rel="noopener noreferrer">
            <ArrowUpRight className="h-4 w-4" />
            See All
          </a>
        </Button>
      }
    >
      <div className="space-y-4 md:space-y-3">
        {winningHacks.map((hack) => (
          <WinningHackCard key={hack.title} {...hack} />
        ))}
      </div>
    </IdeateSection>
  );
}
