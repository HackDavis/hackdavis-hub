'use client';
import ScoringForm from '../_components/ScoringForm/ScoringForm';
import { useTeam } from '@hooks/useTeam';
import { useSubmission } from '@hooks/useSubmission';
export default function Scoring({ params }: { params: { team_id: string } }) {
  const team_id = params.team_id;
  const { team, loading: teamLoading } = useTeam(team_id as string);
  const { submission, loading: submissionLoading } = useSubmission(
    team_id as string
  );
  if (submissionLoading || teamLoading) {
    return 'loading...';
  }

  if (team.body === null || submission.body === null) {
    return 'something went wrong.';
  }

  return <ScoringForm team={team.body} submission={submission.body} />;
}
