import patientSimImage from '@public/hackers/starter-kit/ideate/patient_sim_ai.png';
import nomadImage from '@public/hackers/starter-kit/ideate/nomad.png';
import { Button } from '@globals/components/ui/button';
import IdeateSection from './IdeateSection';
import WinningHackCard from './WinningHackCard';

const devPostLink =
  'https://hackdavis-2024.devpost.com/project-gallery?_gl=1%2A50gpw%2A_gcl_au%2AMTc2MTUwMzcxOS4xNzQwODA4MTQ4%2A_ga%2AMjEwNzI2OTk2My4xNzQwODA4MTQ4%2A_ga_0YHJK3Y10M%2AMTc0MDgwODE0Ny4xLjEuMTc0MDgwODE3OS4wLjAuMA';

function SkinScreenVisual() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[linear-gradient(135deg,#1f2455_0%,#0b1730_40%,#3a4f8c_100%)]">
      <div className="absolute -left-5 top-6 h-24 w-24 rounded-full bg-[#8392ff]/30 blur-2xl" />
      <div className="absolute right-4 top-4 h-20 w-20 rounded-full bg-[#7bd4ff]/20 blur-2xl" />
      <div className="absolute left-6 top-8 h-[78%] w-[34%] rounded-[18px] border border-white/10 bg-[#111830] shadow-[0_10px_25px_rgba(0,0,0,0.35)]" />
      <div className="absolute left-[22%] top-12 h-[58%] w-[22%] rounded-[14px] border border-white/10 bg-[#1d2852]" />
      <div className="absolute right-[17%] top-9 h-[74%] w-[28%] rounded-[18px] border border-white/10 bg-[#141d3d]" />
      <div className="absolute left-8 top-12 h-4 w-16 rounded-full bg-white/10" />
      <div className="absolute left-[25%] top-16 h-3 w-8 rounded-full bg-[#78c9ff]/60" />
      <div className="absolute right-[20%] top-14 h-16 w-16 rounded-full border border-[#7bd4ff]/40" />
      <div className="absolute right-[22%] top-16 h-12 w-12 rounded-full bg-[radial-gradient(circle,#8ae1ff_0%,#8ae1ff_25%,transparent_26%)]" />
      <div className="absolute right-[21%] bottom-9 h-10 w-14 rounded-[10px] bg-white/10" />
    </div>
  );
}

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
    award: 'Best AI Hack',
    year: '2023',
    title: 'SkinScreen',
    description:
      'SkinScreen used AI to measure skin lesion risk and help users identify potential skin conditions, making early awareness and accessible education easier.',
    link: devPostLink,
    visual: <SkinScreenVisual />,
  },
];

export default function IdeateWinningHacks() {
  return (
    <IdeateSection
      eyebrow="Previous Winning Hacks"
      title="Reference what resonated before"
      action={
        <Button
          asChild
          variant="outline"
          className="h-10 rounded-full border-[#2d3230] bg-transparent px-5 text-sm font-medium text-[#2d3230] shadow-none hover:bg-[#2d3230] hover:text-white"
        >
          <a href={devPostLink} target="_blank" rel="noopener noreferrer">
            See All
          </a>
        </Button>
      }
    >
      <div className="space-y-4">
        {winningHacks.map((hack) => (
          <WinningHackCard key={hack.title} {...hack} />
        ))}
      </div>
    </IdeateSection>
  );
}
