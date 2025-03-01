import Brainstorm from '../StarterKit/Brainstorm';
import StarterKitSlide from '../StarterKit/StarterKitSlide';

export default function Ideate() {
  return (
    <div className="flex flex-col gap-8 md:gap-12 xl:gap-16">
      {/* The children here should be StarterKitSlide components that wrap around the component content you created */}
      {/* Refer ./LetsBegin.tsx */}

      <h1>Stage 3 (Replace this w the components)</h1>
      {/* ensure the content, esp text, within each component horizontally lines up with the content inside other components */}
      <StarterKitSlide title="Brainstorm" subtitle="IT’S TIME TO">
        <Brainstorm />
      </StarterKitSlide>
    </div>
  );
}
