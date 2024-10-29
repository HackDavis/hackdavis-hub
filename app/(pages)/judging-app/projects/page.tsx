'use client';

import ProtectedDisplay from '@components/ProtectedDisplay/ProtectedDisplay';
import LoginPage from '../_components/LoginPage/LoginPage';
// import SearchBar from './_components/SearchBar';
import ProjectPage from 'app/(pages)/(index-page)/_components/ProjectsPage/ProjectPage';

export default function Judges() {
  return (
    <ProtectedDisplay loadingDisplay={'loading...'} failDisplay={<LoginPage />}>
      <div>
        <ProjectPage />
      </div>
    </ProtectedDisplay>
  );
}
