import styles from './ScoringForm.module.scss';
import RadioSelect from '@components/RadioSelect/RadioSelect';
import tracks from '@data/tracks';
import { useRef, useState } from 'react';

interface ScoringFormProps {
  submission_id: string;
}

const judgingCategories = [
  'Overall Scoring',
  'Best Usage of MongoDB',
  'Best Social Hack',
  'Best Beginner Hack',
  'Best Design',
];

const SEP = '::';

export default function ScoringForm({ submission_id: _ }: ScoringFormProps) {
  const dataRef = useRef({});
  const [comment, setComment] = useState('');

  const setData = (
    key: string,
    value: { track: string; question: string; value: any }
  ) => {
    dataRef.current = {
      ...dataRef.current,
      [key]: value,
    };
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Correct way to prevent form submission
    console.log({
      comment,
      data: dataRef.current,
    });
  };
  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <div className={styles.comments_container}>
        <h2 className={styles.category_header}>Comments</h2>
        <p>Write down some thoughts here!</p>
        <textarea
          className={styles.comment_box}
          name="comments"
          value={comment}
          placeholder={'Notes...'}
          onChange={(event) => {
            setComment(event.target.value);
          }}
        />
      </div>
      {judgingCategories.map((category) => (
        <div key={category} className={styles.track_container}>
          <h2 className={styles.category_header}>{category}</h2>
          {tracks[category].map((question) => (
            <RadioSelect
              key={`${category}: ${question}`}
              question={question}
              onChange={(value) => {
                setData(`${category}${SEP}${question}`, {
                  track: category,
                  question,
                  value,
                });
              }}
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
