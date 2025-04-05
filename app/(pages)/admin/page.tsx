import Link from 'next/link';

export default function Admin() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Link href="/admin/csv">Import Teams with CSV</Link>
      <Link href="/admin/match">Group Judges and Teams</Link>
      <Link href="/admin/invite-link">Invite Users</Link>
    </div>
  );
}
