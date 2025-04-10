'use client';

import styles from './ReportModal.module.scss';
import { RxCross2 } from 'react-icons/rx';

interface ReportModalProps {
  modalStage: 'hidden' | 'loading' | 'error' | 'success';
  setModalStage: React.Dispatch<
    React.SetStateAction<'hidden' | 'loading' | 'error' | 'success'>
  >;
  errorMsg: string | null;
}

export default function ReportModal({
  modalStage,
  setModalStage,
  errorMsg,
}: ReportModalProps) {
  const loadingContent = (
    <div className={styles.loading_container}>loading...</div>
  );

  const successContent = (
    <div className={styles.success_container}>
      <h2>Team successfully reported!</h2>
      <div
        className={styles.ack_button}
        onClick={() => setModalStage('hidden')}
      >
        Back to judging
      </div>
    </div>
  );

  const errorContent = (
    <div className={styles.error_container}>
      <h2>Something went wrong.</h2>
      <p>{errorMsg}</p>
    </div>
  );

  const content: {
    [state: string]: React.ReactNode;
  } = {
    loading: loadingContent,
    success: successContent,
    error: errorContent,
  };

  return (
    <div
      className={`${styles.background_container} ${
        modalStage === 'hidden' ? styles.hidden : null
      }`}
    >
      <div className={styles.container}>
        <div
          className={styles.close_button}
          onClick={() => setModalStage('hidden')}
        >
          <RxCross2 className={styles.exit_button} />
        </div>
        {content[modalStage]}
      </div>
    </div>
  );
}
