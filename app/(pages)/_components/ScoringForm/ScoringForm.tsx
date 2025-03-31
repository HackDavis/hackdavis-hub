'use client';
import styles from './ScoringForm.module.scss';
import RadioSelect from '@components/RadioSelect/RadioSelect';
import tracks from '@data/tracks';
import Submission from '@typeDefs/submission';
import Team from '@typeDefs/team';
import { useRef, useState } from 'react';
import { UpdateSubmission, FlattenScores } from 'app/(pages)/_utils/FormParser';
import updateSubmission from '@actions/submissions/updateSubmission';
import { useRouter } from 'next/navigation';

interface ScoringFormProps {
  team: Team;
  submission: Submission;
}

const overallScoringCategory = [
  { displayName: 'Social Good', name: 'social_good' },
  { displayName: 'Creativity', name: 'creativity' },
  { displayName: 'Presentation', name: 'presentation' },
];

const SEP = '::';

export default function ScoringForm({ team, submission }: ScoringFormProps) {
  const unfilledDynamicQuestions = Object.fromEntries(
    team.tracks
      .map((trackName) =>
        tracks[trackName].map((track) => [
          [`${trackName}${SEP}${track.attribute}`],
          null,
        ])
      )
      .flat()
  );

  const router = useRouter();
  const dynamicQuestionsRef = useRef({
    ...unfilledDynamicQuestions,
    ...FlattenScores(submission.scores),
  });
  const [baseQuestions, setBaseQuestions] = useState({
    comments: submission.comments,
    social_good: submission.social_good,
    creativity: submission.creativity,
    presentation: submission.presentation,
  } as { [key: string]: any });

  const isEditMode = submission.is_scored;

  const setData = (key: string, value: number) => {
    dynamicQuestionsRef.current = {
      ...dynamicQuestionsRef.current,
      [key]: value,
    };
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    function isNotNullish(x: any) {
      return x !== null && x !== undefined;
    }

    // validate form
    const baseFilled = Object.values(baseQuestions).every(isNotNullish);
    const dynamicFilled = Object.values(dynamicQuestionsRef.current).every(
      isNotNullish
    );

    if (!baseFilled || !dynamicFilled) {
      alert('Not all form fields are filled out!');
      return;
    }

    const updatedSubmission = UpdateSubmission(
      submission,
      baseQuestions,
      dynamicQuestionsRef.current
    );

    const updateRes = await updateSubmission(
      submission.judge_id,
      submission.team_id,
      updatedSubmission
    );

    if (updateRes.ok) {
      router.push('/judges/projects');
    } else {
      alert(updateRes.error);
    }
  };

  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <div className={styles.comments_container}>
        <h2 className={styles.category_header}>Comments</h2>
        <p>Write down some thoughts here!</p>
        <textarea
          className={styles.comment_box}
          name="comments"
          value={baseQuestions.comments}
          placeholder={'Notes...'}
          onChange={(event) => {
            setBaseQuestions((prev: any) => ({
              ...prev,
              comments: event.target.value,
            }));
          }}
        />
      </div>
      <div className={styles.track_container}>
        <h2 className={styles.category_header}>Overall Scoring</h2>
        {overallScoringCategory.map(({ displayName, name }) => (
          <RadioSelect
            key={`Overall Scoring: ${name}`}
            question={displayName}
            onChange={(value) => {
              setBaseQuestions((prev: any) => ({ ...prev, [name]: value }));
            }}
            initValue={baseQuestions[name]}
          />
        ))}
      </div>
      {team.tracks.map((category) => (
        <div key={category} className={styles.track_container}>
          <h2 className={styles.category_header}>{category}</h2>
          {tracks[category].map((question) => (
            <RadioSelect
              key={`${category}: ${question.attribute}`}
              question={question.attribute}
              onChange={(value) => {
                setData(`${category}${SEP}${question.attribute}`, value);
              }}
              initValue={
                dynamicQuestionsRef.current[
                  `${category}${SEP}${question.attribute}`
                ]
              }
            />
          ))}
        </div>
      ))}
      <button type="submit" className={styles.submit_button}>
        {isEditMode ? 'Edit' : 'Submit'} Scores
      </button>
    </form>
  );
}
