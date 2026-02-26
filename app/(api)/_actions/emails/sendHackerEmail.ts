'use server';

import createRsvpInvitation from '@actions/tito/createRsvpInvitation';
import GenerateInvite from '@datalib/invite/generateInvite';
import acceptedTemplate from './emailFormats/2026AcceptedTemplate';
import waitlistedTemplate from './emailFormats/2026WaitlistedTemplate';
import waitlistAcceptedTemplate from './emailFormats/2026WaitlistAcceptedTemplate';
import waitlistRejectedTemplate from './emailFormats/2026WaitlistRejectedTemplate';
import { DEFAULT_SENDER, transporter } from './transporter';
import {
  EmailType,
  HackerEmailOptions,
  HackerEmailResponse,
} from '@typeDefs/emails';

export default async function sendHackerEmail(
  options: HackerEmailOptions
): Promise<HackerEmailResponse> {
  try {
    console.log(
      `[Hacker Email] Sending ${options.emailType} to ${options.email}`
    );

    if (!DEFAULT_SENDER) {
      throw new Error('Email configuration missing');
    }

    let titoUrl: string | undefined;
    let hubUrl: string | undefined;
    let htmlContent: string;

    // For accepted hackers, generate both Hub invite and Tito invite
    if (
      options.emailType === '2026AcceptedTemplate' ||
      options.emailType === '2026WaitlistAcceptedTemplate'
    ) {
      if (!options.rsvpListSlug || !options.releaseIds) {
        throw new Error(
          'RSVP list slug and release IDs are required for accepted hackers'
        );
      }

      // 1. Create Tito invitation
      const titoStartTime = Date.now();
      const titoResponse = await createRsvpInvitation({
        firstName: options.firstName,
        lastName: options.lastName,
        email: options.email,
        rsvpListSlug: options.rsvpListSlug,
        releaseIds: options.releaseIds,
      });
      const titoEndTime = Date.now();
      console.log(
        `[Hacker Email] Tito API call took ${
          titoEndTime - titoStartTime
        }ms for ${options.email}`
      );

      if (!titoResponse.ok || !titoResponse.body?.unique_url) {
        throw new Error(
          titoResponse.error || 'Failed to create Tito invitation'
        );
      }

      titoUrl = titoResponse.body.unique_url;

      // 2. Generate Hub invite
      const hubStartTime = Date.now();
      const hubInviteResponse = await GenerateInvite(
        {
          email: options.email,
          name: `${options.firstName} ${options.lastName}`,
          role: 'hacker',
        },
        'invite'
      );
      const hubEndTime = Date.now();
      console.log(
        `[Hacker Email] Hub invite generation took ${
          hubEndTime - hubStartTime
        }ms for ${options.email}`
      );

      if (!hubInviteResponse.ok || !hubInviteResponse.body) {
        throw new Error(
          hubInviteResponse.error || 'Failed to generate Hub invite'
        );
      }

      hubUrl = hubInviteResponse.body;

      // Generate HTML content based on template type
      if (options.emailType === '2026AcceptedTemplate') {
        htmlContent = acceptedTemplate(options.firstName, titoUrl, hubUrl);
      } else {
        htmlContent = waitlistAcceptedTemplate(
          options.firstName,
          titoUrl,
          hubUrl
        );
      }
    } else if (options.emailType === '2026WaitlistedTemplate') {
      htmlContent = waitlistedTemplate(options.firstName);
    } else if (options.emailType === '2026WaitlistRejectedTemplate') {
      htmlContent = waitlistRejectedTemplate(options.firstName);
    } else {
      throw new Error(`Unknown email type: ${options.emailType}`);
    }

    // 3. Send email
    const emailStartTime = Date.now();
    await transporter.sendMail({
      from: DEFAULT_SENDER,
      to: options.email,
      subject: getEmailSubject(options.emailType),
      html: htmlContent,
    });
    const emailEndTime = Date.now();
    console.log(
      `[Hacker Email] Nodemailer sendMail took ${
        emailEndTime - emailStartTime
      }ms for ${options.email}`
    );

    console.log(`[Hacker Email] ✓ Successfully sent to ${options.email}`);

    return {
      ok: true,
      titoUrl,
      hubUrl,
      error: null,
    };
  } catch (e) {
    const error = e as Error;
    console.error(`[Hacker Email] ✗ Failed:`, error);
    return {
      ok: false,
      error: error.message,
    };
  }
}

function getEmailSubject(emailType: EmailType): string {
  switch (emailType) {
    case '2026AcceptedTemplate':
      return "Congratulations! You're Accepted to HackDavis 2025";
    case '2026WaitlistedTemplate':
      return 'HackDavis 2025 Application Update - Waitlisted';
    case '2026WaitlistAcceptedTemplate':
      return "You're Off the Waitlist! Welcome to HackDavis 2025";
    case '2026WaitlistRejectedTemplate':
      return 'HackDavis 2025 Application Update';
    default:
      return 'HackDavis 2025 Update';
  }
}
