import IdeateHero from './IdeateHero';
import IdeateMentorCallout from './IdeateMentorCallout';
import IdeatePrinciples from './IdeatePrinciples';
import IdeateWinningHacks from './IdeateWinningHacks';

export default function Ideate() {
  return (
    <div className="my-[100px] ml-[24px] mr-0 flex flex-col gap-[72px] bg-[#F1FFCC] p-[7%] pr-[7%] md:ml-[60px] md:mr-0 md:gap-[96px]">
      <IdeateHero />
      <IdeatePrinciples />
      <IdeateWinningHacks />
      <IdeateMentorCallout />
    </div>
  );
}
