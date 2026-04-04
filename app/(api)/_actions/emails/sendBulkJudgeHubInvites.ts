'use server';

import { GetManyUsers } from '@datalib/users/getUser';
import processBulkInvites from './processBulkInvites';
import sendSingleJudgeHubInvite from './sendSingleJudgeHubInvite';
import {
  BulkJudgeInviteResponse,
  JudgeInviteData,
  JudgeInviteResult,
} from '@typeDefs/emails';

export default async function sendBulkJudgeHubInvites(
  csvText: string
): Promise<BulkJudgeInviteResponse> {
  return processBulkInvites<JudgeInviteData, JudgeInviteResult>(csvText, {
    label: 'Judge',
    concurrency: 10,

    async preprocess(judges) {
      const allEmails = judges.map((j) => j.email);
      const existingUsers = await GetManyUsers({ email: { $in: allEmails } });
      const existingEmailSet = new Set<string>(
        existingUsers.ok
          ? existingUsers.body.map((u: { email: string }) => u.email)
          : []
      );

      const remaining: JudgeInviteData[] = [];
      const earlyResults: JudgeInviteResult[] = [];

      for (const judge of judges) {
        if (existingEmailSet.has(judge.email)) {
          earlyResults.push({
            email: judge.email,
            success: false,
            error: 'User already exists.',
          });
        } else {
          remaining.push(judge);
        }
      }

      return { remaining, earlyResults };
    },

    async processOne(judge) {
      const result = await sendSingleJudgeHubInvite(judge, true);
      return {
        email: judge.email,
        success: result.ok,
        inviteUrl: result.inviteUrl,
        error: result.error ?? undefined,
      };
    },
  });
}
