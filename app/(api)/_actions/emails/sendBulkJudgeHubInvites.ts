'use server';

import { GetManyUsers } from '@datalib/users/getUser';
import parseInviteCSV from './parseInviteCSV';
import sendSingleJudgeHubInvite from './sendSingleJudgeHubInvite';
import {
  BulkJudgeInviteResponse,
  JudgeInviteData,
  JudgeInviteResult,
} from '@typeDefs/emails';

const CONCURRENCY = 10;

export default async function sendBulkJudgeHubInvites(
  csvText: string
): Promise<BulkJudgeInviteResponse> {
  // Parse and validate CSV
  const parsed = parseInviteCSV(csvText);
  if (!parsed.ok) {
    return {
      ok: false,
      results: [],
      successCount: 0,
      failureCount: 0,
      error: parsed.error,
    };
  }

  const allJudges = parsed.body;
  const results: JudgeInviteResult[] = [];
  let successCount = 0;
  let failureCount = 0;

  // Single upfront duplicate check for all emails at once
  const allEmails = allJudges.map((j) => j.email);
  const existingUsers = await GetManyUsers({ email: { $in: allEmails } });
  const existingEmailSet = new Set<string>(
    existingUsers.ok
      ? existingUsers.body.map((u: { email: string }) => u.email)
      : []
  );

  // Partition judges into duplicates (immediate failure) and new (to send)
  const judges: JudgeInviteData[] = [];
  for (const judge of allJudges) {
    if (existingEmailSet.has(judge.email)) {
      results.push({
        email: judge.email,
        success: false,
        error: 'User already exists.',
      });
      failureCount++;
    } else {
      judges.push(judge);
    }
  }

  for (let i = 0; i < judges.length; i += CONCURRENCY) {
    const batch: JudgeInviteData[] = judges.slice(i, i + CONCURRENCY);

    const batchResults = await Promise.allSettled(
      batch.map((judge) => sendSingleJudgeHubInvite(judge, true))
    );

    for (let j = 0; j < batchResults.length; j++) {
      const result = batchResults[j];
      const email = batch[j].email;

      if (result.status === 'fulfilled' && result.value.ok) {
        results.push({
          email,
          success: true,
          inviteUrl: result.value.inviteUrl,
        });
        successCount++;
      } else {
        const errorMsg =
          result.status === 'rejected'
            ? result.reason?.message ?? 'Unknown error'
            : result.value.error ?? 'Unknown error';
        console.error(`[Bulk Judge Invites] ✗ Failed: ${email}`, errorMsg);
        results.push({ email, success: false, error: errorMsg });
        failureCount++;
      }
    }
  }

  return {
    ok: failureCount === 0,
    results,
    successCount,
    failureCount,
    error:
      failureCount > 0 ? `${failureCount} invite(s) failed to send.` : null,
  };
}
