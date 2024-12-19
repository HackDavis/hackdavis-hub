'use client';
import { useState } from 'react';
import styles from './Comments.module.scss';

export default function Comments({ submission }: { submission: string }) {
  const [commentText, setCommentText] = useState(submission);

  const onCommentType = (e: any) => {
    setCommentText(e.target.value);
  };

  return (
    <div className={styles.commentContainer}>
      <h2 className={styles.commentTitle}>Comments</h2>
      <p className={styles.commentDescription}>
        Comments help us for deciding tiebreakers. If there was an exceptional
        project or one you’re suspicious of cheating, write it here!
      </p>
      <textarea
        className={styles.commentBox}
        name="comments"
        value={commentText}
        onChange={onCommentType}
        placeholder="Write a comment here..."
      ></textarea>
    </div>
  );
}
