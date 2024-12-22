'use client';

import ProtectedDisplay from '@components/ProtectedDisplay/ProtectedDisplay';
// import SearchBar from './_components/SearchBar';
import ProjectPage from './_components/ProjectPage';

export default function Judges() {
  return (
    <ProtectedDisplay allowedRoles="admin judge">
      <div className="tw-flex tw-flex-col tw-h-full tw-bg-[#F2F2F7]">
        <ProjectPage />
      </div>
    </ProtectedDisplay>
  );
}
