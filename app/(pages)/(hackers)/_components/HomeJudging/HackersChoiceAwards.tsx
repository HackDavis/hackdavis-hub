import Image from 'next/image';
import hackers_choice_mascots from 'public/hackers/hackers-choice/hackers_choice_mascots.svg';
import TextCard from '../HomeHacking/_components/TextCard';

export default function HackerChoiceAward() {
  return (
    <div className="bg-[#F1FFCC]" id="hackers-choice-awards">
      <div className="flex flex-col md:flex-row items-center justify-between px-[5%] p-[10%] gap-12">
        <div className="flex-1 flex justify-center md:justify-start">
          <Image
            src={hackers_choice_mascots}
            width={424}
            height={611}
            alt="cow and frog hackdavis mascots cheering"
            className="w-auto h-auto max-w-full"
          />
        </div>
        <div className="flex flex-1 justify-end">
          <TextCard
            short_text="CHECK IT OUT"
            title="Hackers Choice Awards"
            long_text="While you wait, put in your choice for your favorite hack! You are allowed 1 vote, and you cannot vote for your own team. "
            button_text="VIEW PROJECTS"
            button_link="https://hackdavis-2026.devpost.com/project-gallery"
            is_external={true}
            secondary_button_text="SUBMIT YOUR VOTE"
            secondary_button_link="https://forms.gle/ubHnU9hv69GDZQfd8"
            secondary_is_external={true}
            button_color="D1F76E"
            text_color="1A3819"
          />
        </div>
      </div>
    </div>
  );
}
