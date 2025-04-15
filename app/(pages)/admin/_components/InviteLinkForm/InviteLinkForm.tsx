import { FormEvent, useState } from "react";

import sendEmail from "@actions/invite/sendEmail";
import FormSubmitConfirmation from "app/(pages)/admin/_components/FormSubmitConfirmation/FormSubmitConfirmation";
import styles from "./InviteLinkForm.module.scss";

export default function InviteLinkForm() {
  const [inviteLink, setInviteLink] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resStatus, setResStatus] = useState<null | string>(null);

  const handleInvite = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const role = formData.get("role") as string;

    const invite = await sendEmail({
      email,
      name,
      role,
    });

    setLoading(false);

    if (invite.body) {
      setInviteLink(invite.body);
      setError("");
      setResStatus("success");
    } else {
      setError(invite.error ?? "An unexpected error occurred.");
      setResStatus("failed");
    }
  };

  const handleClose = () => {
    setLoading(false);
    setResStatus(null);
  };

  return (
    <>
      <form onSubmit={handleInvite} className={styles.form}>
        <h3>Invite a User</h3>
        <div className={styles.fields}>
          <p className={styles.error_msg}>{error}</p>
          <div>
            <label className={styles.label}>Name</label>
            <input name="name" type="text" required />
          </div>
          <div>
            <label className={styles.label}>Email</label>
            <input name="email" type="email" required />
          </div>
          <div className={styles.role_select}>
            <label className={styles.label}>Role</label>
            <div>
              <label>Hacker</label>
              <input name="role" type="radio" value="hacker" />
            </div>
            <div>
              <label>Judge</label>
              <input name="role" type="radio" value="judge" />
            </div>
          </div>
        </div>
        <button type="submit">Invite User</button>
        <p className={styles.link_text}>{inviteLink}</p>
      </form>
      <FormSubmitConfirmation
        pending={loading}
        mailStatus={resStatus}
        handleClose={handleClose}
      />
    </>
  );
}
