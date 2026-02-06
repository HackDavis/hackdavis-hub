'use server';

import createRsvpInvitation from '@actions/tito/createRsvpInvitation';
import nodemailer from 'nodemailer';
import mentorInviteTemplate from './emailFormats/2026MentorInviteTemplate';

const senderEmail = process.env.SENDER_EMAIL;
const password = process.env.SENDER_PWD;

interface MentorData {
  firstName: string;
  lastName: string;
  email: string;
}

interface BulkInviteOptions {
  mentors: MentorData[];
  rsvpListSlug: string;
  releaseIds: string;
}

interface InviteResult {
  email: string;
  success: boolean;
  titoUrl?: string;
  error?: string;
}

interface Response {
  ok: boolean;
  results: InviteResult[];
  successCount: number;
  failureCount: number;
  error: string | null;
}

export default async function sendBulkMentorInvites(
  options: BulkInviteOptions
): Promise<Response> {
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
      if (!senderEmail || !password) {
        throw new Error('Email configuration missing');
      }

      const htmlContent = mentorInviteTemplate(mentor.firstName, titoUrl);

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: senderEmail,
          pass: password,
        },
      });

      await transporter.sendMail({
        from: senderEmail,
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
