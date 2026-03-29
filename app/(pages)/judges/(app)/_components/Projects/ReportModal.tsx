'use client';

import Loader from '@pages/_components/Loader/Loader';
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
  const loadingContent = <Loader modal message="Reporting" />;

  const successContent = (
    <div className={styles.success_container}>
      <h4>Team successfully reported!</h4>
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
      <h4>Something went wrong.</h4>
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
