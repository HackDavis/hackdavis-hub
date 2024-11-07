import styles from './Submission.module.scss';

export default function Submission({
  canSubmit,
  error,
}: {
  canSubmit: boolean;
  error: string;
}) {
  return (
    <div className={styles.container}>
      <p className={styles.error_text}>{error ?? ''}</p>
      <button
        className={`${styles.submitButton} ${
          canSubmit ? null : styles.disabled
        }`}
        type="submit"
        disabled={!canSubmit}
      >
        Submit Score
      </button>
    </div>
  );
}
