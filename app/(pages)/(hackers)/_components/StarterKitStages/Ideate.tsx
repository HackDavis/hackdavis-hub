import StarterKitSlide from '../StarterKit/StarterKitSlide';
import PreviousHacks from '../StarterKit/PreviousHacks';

export default function Ideate() {
  return (
    <div className="flex flex-col gap-8 md:gap-12 xl:gap-16">
      {/* ensure the content, esp text, within each component horizontally lines up with the content inside other components */}
      <StarterKitSlide
        title="Previous Winning Hacks"
        subtitle="YOU CAN REFERENCE"
      >
        <PreviousHacks />
      </StarterKitSlide>
    </div>
  );
}
