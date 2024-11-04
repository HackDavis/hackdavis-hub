'use client';

import InviteLinkForm from '../_components/InviteLinkForm/InviteLinkForm';
import styles from './invite.module.scss';

export default function AdminInviteLinkPage() {
  return (
    <div className={styles.container}>
      <InviteLinkForm />
    </div>
  );
}
