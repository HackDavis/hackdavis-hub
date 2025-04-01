import ProjectTab from './ProjectTab';
import Image from 'next/image';
import projectCow from '/public/judges/projects/project-cow.svg';
import Team from '@typeDefs/team';
import Link from 'next/link';

interface UnjudgedPageProps {
  projects: Team[];
}

const UnjudgedPage = ({ projects }: UnjudgedPageProps) => {
  if (projects.length === 0) {
    return (
      <div className="flex mt-[65px] flex-col items-center h-[calc(100vh-100px)] bg-[#F2F2F7]">
        <span className="text-[32px] font-[700] text-[#000000] mb-[12px]">
          You're Done!
        </span>
        <span className="text-[16px] font-[500] text-[#000000]">
          You've judged all your projects.
        </span>
        <span className="text-[16px] font-[500] text-[#000000] mb-[32px]">
          Thank you so much!
        </span>
        <Image src={projectCow} alt="Project Cow" priority={true} />
      </div>
    );
  }
  return (
    <div className="flex flex-col h-full bg-[#F2F2F7]">
      <span className="text-[32px] font-semibold text-[#000000] mb-[12px]">
        Current Project:
      </span>
      <span className="mb-[24px] text-[18px] font-normal text-[#000000] tracking-[0.36px] leading-[26.1px]">
        Projects must be judged in order one by one order.
      </span>
      <Link
        href={`/judges/score/${projects[0]._id}`}
        className="flex items-center justify-center w-full py-[20px] bg-white rounded-[16px] gap-[16px] mb-[20px]"
      >
        <span className="text-[48px] text-[#000000] leading-[60px] font-[600]">
          {projects[0].teamNumber}
        </span>
        <span className="text-[24px] text-[#000000] tracking-[0.48px] leading-[30px] font-[500]">
          {projects[0].name}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15.4882 11.3215C14.8373 11.9724 14.8373 13.0276 15.4882 13.6785L21.8096 19.9999L15.4882 26.3215C14.8373 26.9724 14.8373 28.0276 15.4882 28.6785C16.139 29.3294 17.1943 29.3294 17.8452 28.6785L25.3452 21.1784C25.6577 20.8659 25.8333 20.442 25.8333 19.9999C25.8333 19.5579 25.6577 19.134 25.3452 18.8214L17.8452 11.3215C17.1943 10.6706 16.139 10.6706 15.4882 11.3215Z"
            fill="#333333"
          />
        </svg>
      </Link>
      <div className="flex h-[284px] bg-[#D9D9D9] rounded-[24px] mb-[20px]"></div>
      <button className="bg-[#005271] text-white rounded-[8px] py-[15px] text-[18px] font-[600] tracking-[0.36px] leading-[18px] mb-[32px]">
        View Project
      </button>
      <span className="text-[32px] font-[600] tracking-[0.64px] text-[#000000] mb-[24px]">
        Next up:
      </span>
      <div className="flex flex-col gap-[16px] mb-[58px] opacity-50">
        {projects.map(
          (project, idx) =>
            idx !== 0 && (
              <ProjectTab key={project._id} team={project} clickable={false} />
            )
        )}
      </div>
    </div>
  );
};

export default UnjudgedPage;
