'use client';
import React, { useState, useEffect } from 'react';
import { FaChevronLeft } from 'react-icons/fa6';
import UnjudgedPage from './UnjudgedPage';
import ScoredPage from './ScoredPage';
import { useSession } from 'next-auth/react';
import { getJudgeSubmissions } from '@actions/submissions/getSubmission';
import { getManyTeams } from '@actions/teams/getTeams';

interface ButtonProps {
  text: string;
  isSelected: boolean;
  width: string;
  onClick: () => void;
}

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
}

interface SubmissionWithTeam extends Submission {
  team?: Team;
}

const Button: React.FC<ButtonProps> = ({
  text,
  isSelected,
  width,
  onClick,
}) => (
  <button
    className={`${width} h-[42px] border-[1.5px] border-[#005271] border-solid rounded-[20px] text-[#005271] text-lg font-semibold tracking-[0.36px] flex items-center justify-center ${
      isSelected ? 'bg-[#9EE7E5]' : 'bg-white'
    }`}
    onClick={onClick}
  >
    {text}
  </button>
);

const ProjectPage = () => {
  const [selectedButton, setSelectedButton] = useState<'Unjudged' | 'Scored'>(
    'Unjudged'
  );
  const { data: session } = useSession();
  const [submissionsWithTeams, setSubmissionsWithTeams] = useState<
    SubmissionWithTeam[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshSubmissions = async () => {
    if (!session?.user?.id) return;

    try {
      setLoading(true);
      setError(null);

      const submissionsResult = await getJudgeSubmissions(
        session.user.id.toString()
      );

      if (!submissionsResult.ok || !submissionsResult.body) {
        setError(submissionsResult.error || 'Failed to fetch submissions');
        return;
      }

      const submissions = submissionsResult.body;

      if (submissions.length === 0) {
        setSubmissionsWithTeams([]);
        return;
      }

      const teamIds = submissions.map((sub: Submission) =>
        sub.team_id.toString()
      );

      const teamsResult = await getManyTeams({
        _id: {
          $in: {
            '*convertIds': {
              ids: teamIds,
            },
          },
        },
      });

      if (!teamsResult.ok || !teamsResult.body) {
        setError(teamsResult.error || 'Failed to fetch teams');
        setSubmissionsWithTeams(
          submissions.map((sub: Submission) => ({ ...sub }))
        );
        return;
      }

      const teamsMap = teamsResult.body.reduce(
        (map: Record<string, Team>, team: Team) => {
          map[team._id.toString()] = team;
          return map;
        },
        {}
      );

      const enrichedSubmissions = submissions.map((sub: Submission) => ({
        ...sub,
        team: teamsMap[sub.team_id.toString()],
      }));

      setSubmissionsWithTeams(enrichedSubmissions);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred'
      );
      setSubmissionsWithTeams([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.id) return;

      try {
        setLoading(true);

        const submissionsResult = await getJudgeSubmissions(
          session.user.id.toString()
        );

        if (!submissionsResult.ok || !submissionsResult.body) {
          setError(submissionsResult.error || 'Failed to fetch submissions');
          return;
        }

        const submissions = submissionsResult.body;

        if (submissions.length === 0) {
          setSubmissionsWithTeams([]);
          return;
        }

        const teamIds = submissions.map((sub: Submission) =>
          sub.team_id.toString()
        );

        const teamsResult = await getManyTeams({
          _id: {
            $in: {
              '*convertIds': {
                ids: teamIds,
              },
            },
          },
        });

        if (!teamsResult.ok || !teamsResult.body) {
          setError(teamsResult.error || 'Failed to fetch teams');
          setSubmissionsWithTeams(
            submissions.map((sub: Submission) => ({ ...sub }))
          );
          return;
        }

        const teamsMap = teamsResult.body.reduce(
          (map: Record<string, Team>, team: Team) => {
            map[team._id.toString()] = team;
            return map;
          },
          {}
        );

        const enrichedSubmissions = submissions.map((sub: Submission) => ({
          ...sub,
          team: teamsMap[sub.team_id.toString()],
        }));

        setSubmissionsWithTeams(enrichedSubmissions);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred'
        );
        setSubmissionsWithTeams([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session?.user?.id]);

  const scoredSubmissions = submissionsWithTeams.filter(
    (sub: SubmissionWithTeam) => sub.is_scored
  );
  const unjudgedSubmissions = submissionsWithTeams.filter(
    (sub: SubmissionWithTeam) => !sub.is_scored
  );

  return (
    <div className="flex flex-col h-full bg-[#F2F2F7]">
      <div className="flex items-center ml-[20px] gap-[12px] mt-[59px]">
        <FaChevronLeft fill="#005271" height={8.48} width={4.24} />
        <span className="font-semibold text-[18px] tracking-[0.36px] text-[#005271] leading-[100%]">
          Back to Projects
        </span>
      </div>
      <div className="flex flex-col px-[20px] mt-[24px]">
        <span className="font-bold text-[48px] tracking-[0.96px] text-[#000000] ">
          Project
        </span>
      </div>
      <div className="flex px-[20px] space-x-[8px] mb-[32px]">
        <Button
          text="Unjudged"
          isSelected={selectedButton === 'Unjudged'}
          width="w-[136px]"
          onClick={() => setSelectedButton('Unjudged')}
        />
        <Button
          text="Scored"
          isSelected={selectedButton === 'Scored'}
          width="w-[114px]"
          onClick={() => setSelectedButton('Scored')}
        />
      </div>
      <div className="px-[20px]">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <p>Loading submissions...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 p-4 rounded">
            <p className="text-red-800">{error}</p>
          </div>
        ) : selectedButton === 'Unjudged' ? (
          <UnjudgedPage
            submissions={unjudgedSubmissions}
            onSubmissionsChange={refreshSubmissions}
          />
        ) : (
          <ScoredPage submissions={scoredSubmissions} />
        )}
      </div>
    </div>
  );
};

export default ProjectPage;
