import Link from 'next/link';

export default function Admin() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Link href="/judges/admin/csv">Import Teams with CSV</Link>
      <Link href="/judges/admin/match">Group Judges and Teams</Link>
      <Link href="/judges/admin/invite-link">Invite Judges</Link>
      <Link href="/judges/admin/reset-link">Generate Reset Password Link</Link>
    </div>
  );
}
