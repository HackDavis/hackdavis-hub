'use server';

import createRsvpInvitation from '@actions/tito/createRsvpInvitation';
import nodemailer from 'nodemailer';
import mentorInviteTemplate from './emailFormats/2026MentorInviteTemplate';

const senderEmail = process.env.SENDER_EMAIL;
const password = process.env.SENDER_PWD;

interface SingleMentorOptions {
  firstName: string;
  lastName: string;
  email: string;
  rsvpListSlug: string;
  releaseIds: string;
}

interface Response {
  ok: boolean;
  titoUrl?: string;
  error: string | null;
}

export default async function sendSingleMentorInvite(
  options: SingleMentorOptions
): Promise<Response> {
  try {
    console.log(`[Single Mentor Invite] Sending invite to ${options.email}`);

    // 1. Create Tito invitation
    const titoResponse = await createRsvpInvitation({
      firstName: options.firstName,
      lastName: options.lastName,
      email: options.email,
      rsvpListSlug: options.rsvpListSlug,
      releaseIds: options.releaseIds,
    });

    if (!titoResponse.ok || !titoResponse.body?.unique_url) {
      throw new Error(titoResponse.error || 'Failed to create Tito invitation');
    }

    const titoUrl = titoResponse.body.unique_url;

    // 2. Send email with Tito URL
    if (!senderEmail || !password) {
      throw new Error('Email configuration missing');
    }

    const htmlContent = mentorInviteTemplate(options.firstName, titoUrl);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: senderEmail,
        pass: password,
      },
    });

    await transporter.sendMail({
      from: senderEmail,
      to: options.email,
      subject: 'Welcome to HackDavis 2025 - Mentor Invitation',
      html: htmlContent,
    });

    console.log(
      `[Single Mentor Invite] ✓ Successfully sent to ${options.email}`
    );

    return {
      ok: true,
      titoUrl,
      error: null,
    };
  } catch (e) {
    const error = e as Error;
    console.error(`[Single Mentor Invite] ✗ Failed:`, error);
    return {
      ok: false,
      error: error.message,
    };
  }
}
