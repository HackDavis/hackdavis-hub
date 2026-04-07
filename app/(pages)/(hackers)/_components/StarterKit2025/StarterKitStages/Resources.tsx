import StarterKitSlide from '../StarterKitSlide';
import ResourceHelp from '../Resources/ResourceHelp';
import DesignersResources from '../Resources/DesignersResources';
import DevelopersResources from '../Resources/DevelopersResources';
import MentorResources from '../Resources/MentorResources';

export default function Resources() {
  return (
    <div className="flex flex-col gap-8 md:gap-12 xl:gap-16">
      {/* ensure the content, esp text, within each component horizontally lines up with the content inside other components */}
      <StarterKitSlide title="You're Ready!" subtitle="AND NOW">
        <ResourceHelp />
      </StarterKitSlide>
      <StarterKitSlide title="Designers" subtitle="MORE RESOURCES FOR">
        <DesignersResources />
      </StarterKitSlide>
      <StarterKitSlide title="Developers" subtitle="MORE RESOURCES FOR">
        <DevelopersResources />
      </StarterKitSlide>
      <MentorResources />
    </div>
  );
}
