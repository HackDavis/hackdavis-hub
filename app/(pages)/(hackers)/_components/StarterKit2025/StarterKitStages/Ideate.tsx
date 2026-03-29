import StarterKitSlide from '../StarterKitSlide';
import PreviousHacks from '../PreviousHacks';
import Brainstorm from '../Brainstorm';
import MentorResources from '../Resources/MentorResources';

export default function Ideate() {
  return (
    <div className="flex flex-col gap-8 md:gap-12 xl:gap-16">
      <StarterKitSlide title="Brainstorm" subtitle="IT’S TIME TO">
        <Brainstorm />
      </StarterKitSlide>
      <StarterKitSlide
        title="Previous Winning Hacks"
        subtitle="YOU CAN REFERENCE"
      >
        <PreviousHacks />
      </StarterKitSlide>
      <MentorResources />
    </div>
  );
}
