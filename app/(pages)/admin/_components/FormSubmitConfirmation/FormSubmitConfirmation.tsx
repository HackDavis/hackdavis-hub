'use client';
import styles from './FormSubmitConfirmation.module.scss';
import { FaXmark } from 'react-icons/fa6';
import { IoIosCheckmarkCircle } from 'react-icons/io';

interface Props {
  pending: boolean;
  mailStatus: string | null;
  handleClose: () => void;
}

export default function FormSubmitConfirmation({
  pending,
  mailStatus,
  handleClose,
}: Props) {
  return (
    <div className={styles.main_container}>
      {(pending || mailStatus) && (
        <div className={styles.confirmation_modal_backdrop}>
          <div className={styles.confirmation_modal_container}>
            {pending && (
              <div className={styles.loading_container}>
                <h3>Hold on while we receive your request.</h3>
                <div className={styles.loader}></div>
              </div>
            )}
            {mailStatus === 'success' && (
              <div className={styles.ok_container}>
                <div className={styles.ok_circle}>
                  <IoIosCheckmarkCircle />
                </div>
                <h3 className={styles.ok_header}>Yipeee!</h3>
                <p className={styles.ok_text}>Invitation successfully sent!</p>
                <button className={styles.x_button} onClick={handleClose}>
                  <div>
                    <FaXmark />
                  </div>
                </button>
              </div>
            )}
            {mailStatus === 'failed' && (
              <div className={styles.ok_container}>
                <h3 className={styles.ok_header}>oof</h3>
                <p className={styles.ok_text}>Something went wrong.</p>
                <button className={styles.x_button} onClick={handleClose}>
                  <div>
                    <FaXmark />
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
