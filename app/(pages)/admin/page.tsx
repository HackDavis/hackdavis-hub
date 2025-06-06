import Link from 'next/link';

export default function Admin() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Link href="/admin/dashboard">Dashboard</Link>
      <Link href="/admin/csv">Import Teams with CSV</Link>
      <Link href="/admin/match">Group Judges and Teams</Link>
      <Link href="/admin/panels">Create Panels</Link>
      <Link href="/admin/invite-link">Invite Users</Link>
      <Link href="/admin/score">Score and Shortlist</Link>
      <Link href="/admin/randomize-projects">Randomize Projects</Link>
      <Link href="/admin/announcements">Announcements</Link>
      <Link href="/admin/rollouts">Rollouts</Link>
      <Link href="/admin/judges">View Judges</Link>
      <Link href="/admin/teams">View Teams</Link>
    </div>
  );
}
