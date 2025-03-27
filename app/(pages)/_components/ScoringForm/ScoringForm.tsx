import styles from './ScoringForm.module.scss';
import RadioSelect from '@components/RadioSelect/RadioSelect';
import tracks from '@data/tracks';
import Submission from '@typeDefs/submission';
import { useRef, useState } from 'react';
import {
  UpdateSubmission,
  FlattenScores,
} from 'app/(pages)/judges/(app)/score/[team-id]/FormParser';
import updateSubmission from '@actions/submissions/updateSubmission';

interface ScoringFormProps {
  submission: Submission;
}

const overallScoringCategory = [
  { displayName: 'Social Good', name: 'social_good' },
  { displayName: 'Creativity', name: 'creativity' },
  { displayName: 'Presentation', name: 'presentation' },
];

const judgingCategories = [
  'Best Usage of MongoDB',
  'Best Social Hack',
  'Best Beginner Hack',
  'Best Design',
];

const SEP = '::';

export default function ScoringForm({ submission }: ScoringFormProps) {
  const dynamicQuestionsRef = useRef(FlattenScores(submission.scores));
  const [baseQuestions, setBaseQuestions] = useState({
    comments: submission.comments,
    social_good: submission.social_good,
    creativity: submission.creativity,
    presentation: submission.presentation,
  } as { [key: string]: any });

  const setData = (key: string, value: number) => {
    dynamicQuestionsRef.current = {
      ...dynamicQuestionsRef.current,
      [key]: value,
    };
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

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

    console.log(updateRes);
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
      {judgingCategories.map((category) => (
        <div key={category} className={styles.track_container}>
          <h2 className={styles.category_header}>{category}</h2>
          {tracks[category].map((question) => (
            <RadioSelect
              key={`${category}: ${question}`}
              question={question}
              onChange={(value) => {
                setData(`${category}${SEP}${question}`, value);
              }}
              initValue={
                dynamicQuestionsRef.current[`${category}${SEP}${question}`]
              }
            />
          ))}
        </div>
      ))}
      <button type="submit" className={styles.submit_button}>
        Submit Scores
      </button>
    </form>
  );
}
