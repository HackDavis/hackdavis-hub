import StarterKitSlide from "../StarterKit/StarterKitSlide";
import EventPosting from "../StarterKit/EventPosting/EventPosting";
import FindTheRightFit from "../StarterKit/FindTheRightFit/FindTheRightFit";
import UseOurDiscordComponent from "../StarterKit/UseOurDiscord/UseOurDiscord";

export default function FindATeam() {
  return (
    <div className="flex flex-col gap-8 md:gap-12 xl:gap-16">
      <StarterKitSlide title="Team Formation Mixer" subtitle="JOIN US FOR OUR">
        <EventPosting
          location="ARC Ballroom A"
          color="var(--grass-background-light)"
          time="8:30am - 10am"
          description="Don't have a team yet? Join our day-of-the-event team mixer on April 19th and find your gang!"
        ></EventPosting>
      </StarterKitSlide>
      <FindTheRightFit />
      <UseOurDiscordComponent />
    </div>
  );
}
