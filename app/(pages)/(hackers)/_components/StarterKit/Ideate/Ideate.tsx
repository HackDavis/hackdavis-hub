import IdeateHero from './IdeateHero';
import IdeateMentorCallout from './IdeateMentorCallout';
import IdeatePrinciples from './IdeatePrinciples';
import IdeateWinningHacks from './IdeateWinningHacks';

export default function Ideate() {
  return (
    <div className="flex flex-col gap-[112px] bg-[#F1FFCC] py-[7%] px-[4%] md:gap-[144px]">
      <IdeateHero />
      <IdeatePrinciples />
      <IdeateWinningHacks />
      <IdeateMentorCallout />
    </div>
  );
}
