import { AlertTriangle, Lightbulb, Target, Users } from 'lucide-react';
import IdeateInfoCard from './IdeateInfoCard';
import IdeateSection from './IdeateSection';

function ImpactVisual() {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="absolute h-24 w-24 rounded-full bg-white/60 blur-xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#7de0ef_0,#7de0ef_8%,transparent_8.5%)] bg-[length:20px_20px] opacity-30" />
      <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-white/70 shadow-[0_12px_25px_rgba(77,183,217,0.25)]">
        <Lightbulb className="h-10 w-10 text-[#f1ad2f]" strokeWidth={2.2} />
      </div>
      <div className="absolute left-5 top-5 rounded-full bg-[#f6a7d1] p-2 text-[#8b3f70] shadow-sm">
        <Users className="h-4 w-4" />
      </div>
      <div className="absolute bottom-5 right-5 rounded-full bg-[#fff4b3] p-2 text-[#8a6d12] shadow-sm">
        <AlertTriangle className="h-4 w-4" />
      </div>
    </div>
  );
}

function AudienceVisual() {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="absolute left-6 top-7 h-16 w-16 rounded-full bg-[#7fcb5b]" />
      <div className="absolute right-8 top-8 h-14 w-14 rounded-full bg-white/90" />
      <div className="absolute bottom-7 left-1/2 h-20 w-24 -translate-x-1/2 rounded-[999px_999px_16px_16px] bg-[#f8cf67]" />
      <div className="absolute left-4 top-5 rounded-full bg-[#c9f4ff] p-2 text-[#4c9bb8]">
        <Users className="h-4 w-4" />
      </div>
      <div className="absolute right-5 top-5 rounded-full bg-[#f6a7d1] p-2 text-[#8b3f70]">
        <Target className="h-4 w-4" />
      </div>
      <div className="absolute bottom-5 left-4 h-8 w-8 rounded-full border border-[#8bc7d4] bg-transparent" />
      <div className="absolute bottom-7 left-6 h-4 w-4 rounded-full border border-[#8bc7d4] bg-transparent" />
      <div className="absolute top-10 left-11 h-3 w-3 rounded-full bg-[#243a3a]" />
      <div className="absolute top-10 right-12 h-3 w-3 rounded-full bg-[#243a3a]" />
    </div>
  );
}

function StandOutVisual() {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="absolute left-8 top-8 rounded-full bg-[#d9fff2] p-3 text-[#1d8f95] shadow-sm">
        <Users className="h-5 w-5" />
      </div>
      <div className="absolute right-8 top-7 rounded-full bg-[#f6a7d1] p-3 text-[#8b3f70] shadow-sm">
        <Lightbulb className="h-5 w-5" />
      </div>
      <div className="absolute bottom-7 left-8 rounded-full bg-[#f9f3a6] p-3 text-[#8a6d12] shadow-sm">
        <Target className="h-5 w-5" />
      </div>
      <div className="absolute bottom-5 right-7 flex h-14 w-14 items-center justify-center rounded-full bg-[#7fcb5b] text-white shadow-sm">
        <span className="text-xl">+</span>
      </div>
    </div>
  );
}

const principles = [
  {
    title: 'Impact Level',
    description:
      'Does your project solve a real problem? Strong projects are rooted in something people actually need help with.',
    visual: <ImpactVisual />,
  },
  {
    title: 'Tailor for Audience',
    description:
      'Who are your users? What are their pain points? When you build for a specific need, the value is much easier to see.',
    visual: <AudienceVisual />,
  },
  {
    title: 'Set Yourself Apart',
    description:
      'What makes your solution unique? Find your hook. Your project does not need to be huge, but it should feel memorable and purposeful.',
    visual: <StandOutVisual />,
  },
];

export default function IdeatePrinciples() {
  return (
    <IdeateSection
      eyebrow="Rules of Brainstorming"
      title="Keep these in mind..."
    >
      <div className="grid gap-4 md:grid-cols-3 md:gap-5">
        {principles.map((principle) => (
          <IdeateInfoCard key={principle.title} {...principle} />
        ))}
      </div>
    </IdeateSection>
  );
}
