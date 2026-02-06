'use server';

import createRsvpInvitation from '@actions/tito/createRsvpInvitation';
import mentorInviteTemplate from './emailFormats/2026MentorInviteTemplate';
import { DEFAULT_SENDER, transporter } from './transporter';
import {
  BulkInviteOptions,
  BulkInviteResponse,
  InviteResult,
} from '@typeDefs/emails';

export default async function sendBulkMentorInvites(
  options: BulkInviteOptions
): Promise<BulkInviteResponse> {
  const results: InviteResult[] = [];
  let successCount = 0;
  let failureCount = 0;

  console.log(
    `[Bulk Mentor Invites] Starting bulk send for ${options.mentors.length} mentors`
  );

  for (const mentor of options.mentors) {
    try {
      console.log(`[Bulk Mentor Invites] Processing mentor: ${mentor.email}`);

      // 1. Create Tito invitation
      const titoResponse = await createRsvpInvitation({
        firstName: mentor.firstName,
        lastName: mentor.lastName,
        email: mentor.email,
        rsvpListSlug: options.rsvpListSlug,
        releaseIds: options.releaseIds,
      });

      if (!titoResponse.ok || !titoResponse.body?.unique_url) {
        throw new Error(
          titoResponse.error || 'Failed to create Tito invitation'
        );
      }

      const titoUrl = titoResponse.body.unique_url;

      // 2. Send email with Tito URL
      if (!DEFAULT_SENDER) {
        throw new Error('Email configuration missing');
      }

      const htmlContent = mentorInviteTemplate(mentor.firstName, titoUrl);

      await transporter.sendMail({
        from: DEFAULT_SENDER,
        to: mentor.email,
        subject: 'Welcome to HackDavis 2025 - Mentor Invitation',
        html: htmlContent,
      });

      results.push({
        email: mentor.email,
        success: true,
        titoUrl,
      });
      successCount++;

      console.log(`[Bulk Mentor Invites] ✓ Success: ${mentor.email}`);
    } catch (e) {
      const error = e as Error;
      console.error(
        `[Bulk Mentor Invites] ✗ Failed: ${mentor.email}`,
        error.message
      );

      results.push({
        email: mentor.email,
        success: false,
        error: error.message,
      });
      failureCount++;
    }
  }

  console.log(
    `[Bulk Mentor Invites] Complete: ${successCount} success, ${failureCount} failed`
  );

  return {
    ok: failureCount === 0,
    results,
    successCount,
    failureCount,
    error: failureCount > 0 ? `${failureCount} invites failed` : null,
  };
}
