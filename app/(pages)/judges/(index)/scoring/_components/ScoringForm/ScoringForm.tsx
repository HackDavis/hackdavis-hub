'use client';
import { useState, useEffect } from 'react';
import { useFormState } from 'react-dom';

import styles from './ScoringForm.module.scss';

import TeamBlock from './ScoringSubComponents/TeamBlock';
import ScoringInput from './ScoringSubComponents/ScoreInput';
import Comments from './ScoringSubComponents/Comments';
import Submission from './ScoringSubComponents/Submission';

import updateSubmission from '@actions/submissions/updateSubmission';

import Team from '@typeDefs/team';
<<<<<<< HEAD:app/(pages)/judging-app/scoring/_components/ScoringForm/ScoringForm.tsx
import SubmissionInt from '@typeDefs/score';
=======
import SubmissionType from '@typeDefs/submission';
>>>>>>> 95b4e4b5adb199a409d29786cc4d53cbe5e0ba0c:app/(pages)/judges/(index)/scoring/_components/ScoringForm/ScoringForm.tsx
import { useRouter } from 'next/navigation';

const generalScoreNames = [
  'Social Good',
  'Technical Complexity',
  'Design',
  'Creativity',
  'Presentation',
];

export default function ScoringForm({
  team,
  submission,
}: {
  team: Team;
<<<<<<< HEAD:app/(pages)/judging-app/scoring/_components/ScoringForm/ScoringForm.tsx
  submission: SubmissionInt;
=======
  submission: SubmissionType;
>>>>>>> 95b4e4b5adb199a409d29786cc4d53cbe5e0ba0c:app/(pages)/judges/(index)/scoring/_components/ScoringForm/ScoringForm.tsx
}) {
  const scores =
    (submission.scores
      .randomKeyThatNeedsToBeReplacedWhenThisComponentIsRefactored as number[]) ??
    generalScoreNames.map((_) => -1);

  const already_done = submission.scores ? generalScoreNames.length : 0;

  const router = useRouter();
  const [updateState, UpdateSubmission] = useFormState(updateSubmission, {
    ok: false,
    body: null,
    error: '',
  });

  const [ready, setReady] = useState(5 + team.tracks.length - already_done);

  useEffect(() => {
    if (updateState.ok === true) {
      router.push('/judges');
    }
  }, [updateState, router]);

  return (
    <div className={styles.container}>
      <TeamBlock team={team} />
      <form action={UpdateSubmission}>
        <input
          name="judge_id"
          type="hidden"
          defaultValue={submission.judge_id}
        />
        <input name="team_id" type="hidden" defaultValue={team._id} />
        <ScoringInput
          inputNameHeader="Overall Scoring"
          inputScoreNames={generalScoreNames}
          setReady={setReady}
          submission={scores}
        />
        <div>
          <Comments submission={submission.scores.comments ?? ''} />
          <Submission
            canSubmit={ready <= 0}
            error={updateState.error ? updateState.error : ''}
          />
        </div>
      </form>
    </div>
  );
}
