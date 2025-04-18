import StarterKitSlide from '../StarterKit/StarterKitSlide';
import ResourceHelp from '../StarterKit/Resources/ResourceHelp';
import DesignersResources from '../StarterKit/Resources/DesignersResources';
import DevelopersResources from '../StarterKit/Resources/DevelopersResources';
// import MentorResources from '../StarterKit/Resources/MentorResources';

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
      {/* <MentorResources /> */}
    </div>
  );
}
