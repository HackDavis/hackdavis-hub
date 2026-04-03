import IdeateHero from './IdeateHero';
import IdeateMentorCallout from './IdeateMentorCallout';
import IdeatePrinciples from './IdeatePrinciples';
import IdeateWinningHacks from './IdeateWinningHacks';

export default function Ideate() {
  return (
    <div className="my-[100px] mx-[24px] p-[7%] md:mx-[60px] bg-[#F1FFCC] border-2 border border-black flex flex-col gap-[48px]">
      <IdeateHero />
      <IdeatePrinciples />
      <IdeateWinningHacks />
      <IdeateMentorCallout />
    </div>
  );
}
