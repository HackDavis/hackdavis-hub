import Image from "next/image";
import projectCow from "/public/judges/projects/project-cow.svg";

export default function ProjectsEmptyState({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex mt-[65px] flex-col items-center h-[calc(100vh-100px)] bg-[#F2F2F7] text-center">
      <span className="text-[32px] font-[700] text-[#000000] mb-[12px]">
        {title}
      </span>
      <span className="text-[16px] font-[500] text-[#000000] whitespace-pre-line mb-[32px]">
        {subtitle}
      </span>
      <Image src={projectCow} alt="Project Cow" />
    </div>
  );
}
