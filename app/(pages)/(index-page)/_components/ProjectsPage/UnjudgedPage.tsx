import React from 'react';

const currentProject = {
  id: 117,
  name: 'Haptic Hand',
};

const nextProjects = [
  { id: 17, name: 'Not Haptic Hand' },
  { id: 20, name: 'Fun fun project' },
  { id: 80, name: 'Happy name' },
  { id: 36, name: 'Another Happy name' },
];

const UnjudgedPage = () => {
  return (
    <div className="tw-flex tw-flex-col tw-h-full tw-bg-[#F2F2F7]">
      <span className="tw-text-[32px] tw-font-semibold tw-text-[#000000] tw-mb-[12px]">
        Current Project:
      </span>
      <span className="tw-mb-[24px] tw-text-[18px] tw-font-normal tw-text-[#000000] tw-tracking-[0.36px] tw-leading-[26.1px] tw-font-[400]">
        Projects must be judged in order one by one order.
      </span>
      <div className="tw-flex tw-items-center tw-justify-center tw-w-full tw-h-[100px] tw-bg-white tw-rounded-[16px] tw-gap-[16px] tw-mb-[20px]">
        <span className="tw-text-[48px] tw-text-[#000000] tw-leading-[60px] tw-font-[600]">
          {currentProject.id}
        </span>
        <span className="tw-text-[24px] tw-text-[#000000] tw-tracking-[0.48px] tw-leading-[30px] tw-font-[500]">
          {currentProject.name}
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
      </div>
      <div className="tw-flex tw-h-[284px] tw-bg-[#D9D9D9] tw-rounded-[24px] tw-mb-[20px]"></div>
      <button className="tw-bg-[#005271] tw-text-white tw-rounded-[8px] tw-py-[15px] tw-text-[18px] tw-font-[600] tw-tracking-[0.36px] tw-leading-[18px] tw-mb-[32px]">
        View Project
      </button>
      <span className="tw-text-[32px] tw-font-[600] tw-tracking-[0.64px] tw-text-[#000000] tw-mb-[24px]">
        Next up:
      </span>
    </div>
  );
};

export default UnjudgedPage;
