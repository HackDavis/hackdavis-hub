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
  {
    displayName: 'Social Good',
    name: 'social_good',
    guidelines: {
      '1': 'Solves a minor, niche problem, limited community impact.',
      '3': 'Solves a clear problem with moderate community impact and potential sustainability.',
      '5': 'Solves a significant problem with broad, lasting community impact and scalability.',
    },
  },
  {
    displayName: 'Creativity',
    name: 'creativity',
    guidelines: {
      '1': 'Solution is conventional or very similar to existing options.',
      '3': 'Solution offers some unique features or improvements over existing options.',
      '5': 'Solution introduces a novel approach with unique, groundbreaking elements.',
    },
  },
  {
    displayName: 'Presentation',
    name: 'presentation',
    guidelines: {
      '1': 'Pitch is unclear, lacks detail and team understanding.',
      '3': 'Pitch is clear with good detail, but delivery could be more engaging or team involvement is uneven.',
      '5': 'Pitch is compelling, engaging, well-delivered with strong team involvement and clear expertise.',
    },
  },
];

const SEP = '::';

export default function ScoringForm({ team, submission }: ScoringFormProps) {
  const unfilledDynamicQuestions = Object.fromEntries(
    team.tracks
      .map((trackName) =>
        (tracks[trackName].scoring_criteria ?? []).map((track) => [
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
    const baseFilled = Object.entries(baseQuestions).every(([key, value]) => {
      // skip check for 'comments' as it is an optional field
      return key === 'comments' || isNotNullish(value);
    });
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
        {overallScoringCategory.map(({ displayName, name, guidelines }) => (
          <RadioSelect
            key={`Overall Scoring: ${name}`}
            question={displayName}
            rubric={guidelines}
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
          {(tracks[category].scoring_criteria ?? []).map((question) => (
            <RadioSelect
              key={`${category}: ${question.attribute}`}
              question={question.attribute}
              rubric={question.guidelines}
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
