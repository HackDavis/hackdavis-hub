import React from 'react';
import ProjectTab from './ProjectTab';
import Link from 'next/link';

interface Team {
  _id: string;
  teamNumber: number;
  tableNumber: number;
  name: string;
  tracks: string[];
  active: boolean;
}

interface Submission {
  _id: string;
  judge_id: string;
  team_id: string | number;
  social_good?: number;
  creativity?: number;
  presentation?: number;
  scores?: any[];
  comments?: string;
  queuePosition: number;
  is_scored: boolean;
  team?: Team;
}

interface ScoredPageProps {
  submissions: Submission[];
}

const ScoredPage: React.FC<ScoredPageProps> = ({ submissions }) => {
  // Sort submissions by queuePosition for consistency with UnjudgedPage
  const sortedSubmissions = [...submissions].sort(
    (a, b) => a.queuePosition - b.queuePosition
  );

  return (
    <div className="flex flex-col mt-[4px] gap-[16px] mb-[120px]">
      {sortedSubmissions.length === 0 ? (
        <div className="bg-gray-100 p-6 rounded-lg text-center">
          <p className="text-gray-600">No scored projects yet.</p>
        </div>
      ) : (
        sortedSubmissions.map((submission) => (
          <Link
            key={submission._id}
            href={`/judges/project/${submission._id}`}
            className="block"
          >
            <ProjectTab
              number={submission.team?.tableNumber || submission.team_id}
              name={submission.team?.name || `Team ${submission.team_id}`}
            />
          </Link>
        ))
      )}
    </div>
  );
};

export default ScoredPage;
