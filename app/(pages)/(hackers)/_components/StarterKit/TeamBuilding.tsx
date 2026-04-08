import Image from "next/image";
import teamMixer from "@public/hackers/starter-kit/teamMixer.svg";
import mascots from "@public/hackers/starter-kit/mascotSquad.svg";
import cow from "@public/hackers/starter-kit/cowIcon.svg";
import locationIcon from "@public/hackers/starter-kit/locationIcon.svg";
import add from "@public/hackers/starter-kit/add.svg";
import arrow from "@public/hackers/starter-kit/blackArrow.svg";

export default function TeamBuilding() {
  return (
    <section className="px-[120px] py-[120px] bg-[#FAFAFF]">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <p className="text-xs tracking-[0.15em] uppercase text-[#00000066] font-normal">
          Team Building
        </p>

        <h1 className="text-[2rem] font-semibold text-[#1F1F1F] leading-normal">
          Find your squad.
        </h1>

        <p className="text-[1rem] text-[rgba(0, 0, 0, 0.65)] font-normal">
          Building with friends (new or old) is what makes hackathons memorable.
          Looking for a crew? Join us for our in-person Mixer to meet potential
          teammates and brainstorm ideas.
        </p>
      </div>

      {/* Event Card */}
      <div className="mt-[60px] px-8 py-6 rounded-[12px] bg-[#FFE2D5] flex items-center justify-between">
        <div className="flex flex-col gap-[40px] w-full">
          <div>
            <p className="font-normal text-[1.25rem] text-[#52230C]">
              Team Mixer
            </p>

            <div className="flex items-center gap-4 text-[0.875rem] text-[#52230C] mt-1">
              <span>11:00 – 12:00 PM</span>

              <span className="flex items-center gap-1 text-[#52230C]">
                <Image src={locationIcon} alt="Location Icon" />
                ARC Ballroom B
              </span>
            </div>
          </div>

          <div className="flex items-center gap-[8px] w-full">
            <div className="flex -space-x-2">
              <Image src={cow} alt="Cow" />
            </div>

            <span className="text-[0.875rem] text-[#52230C]">
              15 Hackers are attending
            </span>

            <button className="flex ml-auto gap-1 bg-[#FFD5C2] text-[#52230C] text-[0.875rem] font-semibold px-6 py-3 rounded-full">
              <Image src={add} alt="Add Sign" />
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Illustration + Discord CTA */}
      <div className="my-[200px] flex justify-between gap-[100px]">
        <div className="relative mx-auto flex min-w-[420px] max-w-[520px] items-center justify-center overflow-hidden rounded-[26px] bg-transparent aspect-[1.1]">
          <Image
            src={teamMixer}
            alt="Team building illustration"
            className="h-auto w-full object-contain"
          />
        </div>

        <div className="text-[1rem]">
          <p className="text-[1rem] tracking-[0.15em] uppercase text-[#00000066] font-medium">
            Missed the event?
          </p>

          <p className="mt-3 text-[#000000A6]">
            No worries! Jump into our Discord and head to the{" "}
            <span className="text-base font-medium text-[#3a3a3a]">
              #team-formation
            </span>
            channel. Introduce yourself, share your skills, and see who&apos;s
            looking for a teammate.
          </p>

          <div className="mt-5 rounded-[12px] bg-[#EDEDF5] px-[28px] py-[18px] text-[1rem]">
            <em>Pro-tip</em>: You can switch teams anytime before the final
            submission deadline.
          </div>

          <a
            href="#"
            className="mt-8 flex items-center gap-1 text-lg uppercase font-semibold text-[#1F1F1F] underline underline-offset-4 w-fit"
          >
            <Image src={arrow} alt="Arrow Icon" /> GO TO DISCORD
          </a>
        </div>
      </div>

      {/* Guiding Questions */}
      <div className="flex flex-col gap-[60px]">
        <div className="flex flex-col gap-3">
          <p className="text-[1rem] uppercase text-[#00000066] font-normal">
            Guiding questions to find the right team
          </p>

          <h2 className="text-[1.6rem] font-semibold text-[#3a3a3a]">
            Ask yourself questions like…
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {[
            { n: "01.", q: "Is this person passionate about the same tracks?" },
            { n: "02.", q: "Does this person's skills compliment mine?" },
            { n: "03.", q: "Can I see myself working with them for 24 hours?" },
          ].map(({ n, q }) => (
            <div
              key={n}
              className="flex flex-col gap-3 border-l-2 border-[#0000001a] pl-3"
            >
              <span className="text-[1rem] text-[#00000066]">{n}</span>

              <p className="text-[1rem] text-[#00000066]">{q}</p>
            </div>
          ))}
        </div>

        {/* Mascot banner */}
        <div className="relative w-full h-[300px] overflow-hidden rounded-[30px]">
          <Image
            src={mascots}
            alt="HackDavis mascots"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
