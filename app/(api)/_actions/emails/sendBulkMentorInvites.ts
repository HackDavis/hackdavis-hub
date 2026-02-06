'use server';

import createRsvpInvitation from '@actions/tito/createRsvpInvitation';
import mentorInviteTemplate from './emailFormats/2026MentorInviteTemplate';
import { DEFAULT_SENDER, transporter } from './transporter';
import {
  BulkInviteOptions,
  BulkInviteResponse,
  InviteResult,
} from '@typeDefs/emails';

const CONCURRENCY = 10;

async function processMentor(
  mentor: BulkInviteOptions['mentors'][number],
  options: BulkInviteOptions
): Promise<InviteResult> {
  const mentorStartTime = Date.now();
  console.log(`[Bulk Mentor Invites] Processing mentor: ${mentor.email}`);

  // 1. Create Tito invitation
  const titoStartTime = Date.now();
  const titoResponse = await createRsvpInvitation({
    firstName: mentor.firstName,
    lastName: mentor.lastName,
    email: mentor.email,
    rsvpListSlug: options.rsvpListSlug,
    releaseIds: options.releaseIds,
  });
  console.log(
    `[Bulk Mentor Invites] Tito API call took ${Date.now() - titoStartTime}ms for ${mentor.email}`
  );

  if (!titoResponse.ok || !titoResponse.body?.unique_url) {
    throw new Error(titoResponse.error || 'Failed to create Tito invitation');
  }

  const titoUrl = titoResponse.body.unique_url;

  // 2. Send email with Tito URL
  if (!DEFAULT_SENDER) {
    throw new Error('Email configuration missing');
  }

  const htmlContent = mentorInviteTemplate(mentor.firstName, titoUrl);

  const emailStartTime = Date.now();
  await transporter.sendMail({
    from: DEFAULT_SENDER,
    to: mentor.email,
    subject: 'Welcome to HackDavis 2025 - Mentor Invitation',
    html: htmlContent,
  });
  console.log(
    `[Bulk Mentor Invites] Nodemailer sendMail took ${Date.now() - emailStartTime}ms for ${mentor.email}`
  );

  console.log(
    `[Bulk Mentor Invites] ✓ Success: ${mentor.email} (total: ${Date.now() - mentorStartTime}ms)`
  );
  return { email: mentor.email, success: true, titoUrl };
}

export default async function sendBulkMentorInvites(
  options: BulkInviteOptions
): Promise<BulkInviteResponse> {
  const results: InviteResult[] = [];
  let successCount = 0;
  let failureCount = 0;

  const totalStartTime = Date.now();
  const totalBatches = Math.ceil(options.mentors.length / CONCURRENCY);
  console.log(
    `[Bulk Mentor Invites] Starting bulk send for ${options.mentors.length} mentors (concurrency: ${CONCURRENCY}, ${totalBatches} batches)`
  );

  // Process mentors in concurrent batches
  for (let i = 0; i < options.mentors.length; i += CONCURRENCY) {
    const batch = options.mentors.slice(i, i + CONCURRENCY);
    const batchNum = Math.floor(i / CONCURRENCY) + 1;
    const batchStartTime = Date.now();
    console.log(
      `[Bulk Mentor Invites] Processing batch ${batchNum}/${totalBatches} (${batch.length} mentors)`
    );

    const batchResults = await Promise.allSettled(
      batch.map((mentor) => processMentor(mentor, options))
    );

    for (let j = 0; j < batchResults.length; j++) {
      const result = batchResults[j];
      if (result.status === 'fulfilled') {
        results.push(result.value);
        successCount++;
      } else {
        const email = batch[j].email;
        console.error(
          `[Bulk Mentor Invites] ✗ Failed: ${email}`,
          result.reason?.message
        );
        results.push({
          email,
          success: false,
          error: result.reason?.message || 'Unknown error',
        });
        failureCount++;
      }
    }

    console.log(
      `[Bulk Mentor Invites] Batch ${batchNum}/${totalBatches} completed in ${Date.now() - batchStartTime}ms`
    );
  }

  const totalTime = Date.now() - totalStartTime;
  console.log(
    `[Bulk Mentor Invites] Complete: ${successCount} success, ${failureCount} failed in ${(totalTime / 1000).toFixed(1)}s`
  );

  return {
    ok: failureCount === 0,
    results,
    successCount,
    failureCount,
    error: failureCount > 0 ? `${failureCount} invites failed` : null,
  };
}
