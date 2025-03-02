import StarterKitSlide from '../StarterKit/StarterKitSlide';
import PreviousHacks from '../StarterKit/PreviousHacks';
import Brainstorm from '../StarterKit/Brainstorm';

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
    </div>
  );
}
