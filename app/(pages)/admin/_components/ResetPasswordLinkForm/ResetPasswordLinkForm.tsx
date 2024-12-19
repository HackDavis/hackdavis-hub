import { useFormState } from 'react-dom';
import sendInvite from '@actions/invite/sendInvite';
import styles from './ResetPasswordLinkForm.module.scss';

export default function ResetPasswordLinkForm() {
  const [inviteState, inviteAction] = useFormState(sendInvite, null);

  return (
    <form action={inviteAction} className={styles.form}>
      <p>Reset Password for Judge</p>
      <div className={styles.fields}>
        <label>Email</label>
        <input name="email" type="email" />
        <input name="slug" type="hidden" defaultValue="/reset-password" />
      </div>
      <button type="submit">Generate reset password link</button>
      <p className={styles.link_text}>{inviteState ?? ''}</p>
    </form>
  );
}
