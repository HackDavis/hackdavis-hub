'use client';

import JudgeSingleInviteForm from '../_components/JudgeInvites/JudgeSingleInviteForm';
import JudgeBulkInviteForm from '../_components/JudgeInvites/JudgeBulkInviteForm';

export default function InviteJudgesPage() {
  return (
    <div className="p-8 flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Invite Judges</h1>

      <section className="flex flex-col gap-3">
        <h2 className="text-[1.75rem] font-semibold">Invite a Judge</h2>
        <p className="text-sm text-gray-500">
          Send a HackDavis Hub invite to a single judge by entering their
          details below.
        </p>
        <JudgeSingleInviteForm />
      </section>

      <hr />

      <section className="flex flex-col gap-3">
        <h2 className="text-[1.75rem] font-semibold">Bulk Invite Judges</h2>
        <p className="text-sm text-gray-500">
          Upload a CSV with columns{' '}
          <span className="font-mono bg-gray-100 px-1 rounded">
            First Name, Last Name, Email
          </span>{' '}
          to send Hub invites to multiple judges at once.
        </p>
        <JudgeBulkInviteForm />
      </section>
    </div>
  );
}
