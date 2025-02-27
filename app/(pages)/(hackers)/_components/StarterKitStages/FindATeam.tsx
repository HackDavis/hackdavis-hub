import StarterKitSlide from '../StarterKit/StarterKitSlide';
import EventPosting from '../StarterKit/EventPosting';

export default function FindATeam() {
  return (
    <div className="flex flex-col gap-8 md:gap-12 xl:gap-16">
      <StarterKitSlide title="Team Formation Mixer" subtitle="JOIN US FOR OUR">
        <EventPosting
          location="FAKE LOCATION"
          color="var(--grass-background-light)"
          time="11am - 12pm"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip"
        ></EventPosting>
      </StarterKitSlide>
    </div>
  );
}
