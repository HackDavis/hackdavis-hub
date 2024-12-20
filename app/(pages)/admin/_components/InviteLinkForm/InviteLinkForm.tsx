import { useFormState } from 'react-dom';
// import sendInvite from '@actions/invite/sendInvite';
import sendEmail from '@actions/invite/sendEmail';
import styles from './InviteLinkForm.module.scss';
import FormSubmitConfirmation from 'app/(pages)/admin/_components/FormSubmitConfirmation/FormSubmitConfirmation';
import { useEffect, useState } from 'react';

export default function InviteLinkForm() {
  const [loading, setLoading] = useState(false);
  const [resStatus, setResStatus] = useState<null | string>(null);

  const [inviteState, inviteAction] = useFormState(sendEmail, {
    ok: true,
    body: null,
    error: null,
  });

  useEffect(() => {
    if (inviteState.body || inviteState.error) {
      setLoading(false);
      setResStatus(inviteState.ok ? 'success' : 'failed');
    }
  }, [inviteState]);

  const handleClose = () => {
    setLoading(false);
    setResStatus(null);
    window.location.reload();
  };

  return (
    <>
      <form action={inviteAction} className={styles.form}>
        <h3>Invite a Judge</h3>
        <div className={styles.fields}>
          <div>
            <label className={styles.label}>Name</label>
            <input name="name" type="text" required />
          </div>
          <div>
            <label className={styles.label}>Email</label>
            <input name="email" type="email" required />
          </div>
          <div className={styles.specialty_select}>
            <label className={styles.label}>Specialty</label>
            <div>
              <label>Technical</label>
              <input type="checkbox" name="specialty" value="tech" required />
            </div>
            <div>
              <label>Design</label>
              <input type="checkbox" name="specialty" value="design" required />
            </div>
            <div>
              <label>Business</label>
              <input
                type="checkbox"
                name="specialty"
                value="business"
                required
              />
            </div>
          </div>
          <input name="role" type="hidden" value="judge" />
          <input name="slug" type="hidden" defaultValue="/register" />
        </div>
        <button type="submit" onClick={() => setLoading(true)}>
          Invite judge
        </button>
        <p className={styles.link_text}>{inviteState.body ?? ''}</p>
      </form>
      <FormSubmitConfirmation
        pending={loading}
        mailStatus={resStatus}
        handleClose={handleClose}
      />
    </>
  );
}
