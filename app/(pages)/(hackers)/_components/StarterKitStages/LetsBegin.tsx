import StarterKitSlide from "../StarterKit/StarterKitSlide"
import EventPosting from "../StarterKit/EventPosting"
import WorkshopSlides from "../StarterKit/WorkshopSlides"

export default function LetsBegin() {
    return <div className="flex flex-col gap-8 md:gap-12 xl:gap-16">
        <StarterKitSlide title="Hacking 101 Workshop" subtitle="JOIN US FOR OUR">
            <EventPosting
                location="FAKE LOCATION"
                color="var(--background-secondary)"
                time="11am - 12pm"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip"
            ></EventPosting>
        </StarterKitSlide>
        <StarterKitSlide title="In case you missed it..." subtitle="HERE'S A RECAP OF THE WORKSHOP">
            <WorkshopSlides/>
        </StarterKitSlide>
    </div>
}