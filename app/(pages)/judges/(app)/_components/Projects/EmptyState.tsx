import Image from 'next/image';
import projectCow from '/public/judges/projects/project-cow.svg';
import twoStars from '/public/judges/projects/two_stars.svg';

export default function ProjectsEmptyState({
  title,
  subtitle,
  feedbackLink,
}: {
  title: string;
  subtitle: string;
  feedbackLink?: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex w-full justify-end pr-[25%]">
        <Image src={twoStars} alt="Two Stars" />
      </div>
      <span className="text-[32px] font-[700] text-[#000000] mb-[12px]">
        {title}
      </span>
      <span className="text-[16px] font-[500] text-[#000000]">{subtitle}</span>
      <Image src={projectCow} alt="Project Cow" />
      {feedbackLink && (
        <a
          href={feedbackLink}
          target="_blank"
          rel="noreferrer"
          className="mt-[24px] px-[20px] py-[10px] bg-black text-white rounded-full text-[14px] font-semibold hover:opacity-90 transition-opacity"
        >
          Share Feedback
        </a>
      )}
    </div>
  );
}
