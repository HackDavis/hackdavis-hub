import StarterKitSlide from "../StarterKit/StarterKitSlide";
import EventPosting from "../StarterKit/EventPosting/EventPosting";
// import WorkshopSlides from '../StarterKit/WorkshopSlides/WorkshopSlides';

export default function LetsBegin() {
  return (
    <div className="flex flex-col gap-8 md:gap-12 xl:gap-16">
      <StarterKitSlide title="Hacking 101 Workshop" subtitle="JOIN US FOR OUR">
        <EventPosting
          location="ARC Ballroom A"
          color="var(--background-secondary)"
          time="11:30am - 1pm"
          description="Join us on April 19th and hear from a panel of experienced hackers to learn about the hackathon process, how to get started with a project, and what to expect during the hackathon."
        ></EventPosting>
      </StarterKitSlide>
      {/* <StarterKitSlide
        title="In case you missed it..."
        subtitle="HERE'S A RECAP OF THE WORKSHOP"
      >
        <WorkshopSlides />
      </StarterKitSlide> */}
    </div>
  );
}
