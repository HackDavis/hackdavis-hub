'use client';

import ProtectedDisplay from '@components/ProtectedDisplay/ProtectedDisplay';
import LoginPage from 'app/(pages)/judging-app/_components/LoginPage/LoginPage';
// import SearchBar from './_components/SearchBar';
import ProjectPage from './_components/ProjectPage';

export default function Judges() {
  return (
    <ProtectedDisplay loadingDisplay={'loading...'} failDisplay={<LoginPage />}>
      <div className="tw-flex tw-flex-col tw-h-full tw-bg-[#F2F2F7]">
        <ProjectPage />
      </div>
    </ProtectedDisplay>
  );
}
