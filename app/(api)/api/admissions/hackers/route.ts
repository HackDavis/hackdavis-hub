import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import getOrCreateTitoInvitation from '@actions/tito/getOrCreateTitoInvitation';
import getAllRsvpInvitations from '@actions/tito/getAllRsvpInvitations';
import GenerateInvite from '@datalib/invite/generateInvite';
import { GetManyUsers } from '@datalib/users/getUser';
import hackerInviteTemplate, {
  HACKER_EMAIL_SUBJECT,
} from '@actions/emails/emailTemplates/2026HackerInviteTemplate';
import hackerWaitlistAcceptTemplate, {
  HACKER_WAITLIST_ACCEPT_EMAIL_SUBJECT,
} from '@actions/emails/emailTemplates/2026HackerWaitlistAcceptTemplate';
import hackerWaitlistTemplate, {
  HACKER_WAITLIST_EMAIL_SUBJECT,
} from '@actions/emails/emailTemplates/2026HackerWaitlistTemplate';
import hackerRejectionTemplate, {
  HACKER_REJECTION_EMAIL_SUBJECT,
} from '@actions/emails/emailTemplates/2026HackerRejectionTemplate';
import { DEFAULT_SENDER, transporter } from '@actions/emails/transporter';
import createLimiter from '@actions/emails/createLimiter';
import { HACKER_ADMISSION_TYPES, admissionNeedsTitoAndHub } from '@typeDefs/emails';
import type { HackerAdmissionType } from '@typeDefs/emails';

// ── Auth ─────────────────────────────────────────────────────────────────────

function isAuthorized(request: NextRequest): boolean {
  const key = process.env.ADMISSIONS_API_KEY;
  if (!key) return false; // key must be configured; no key = always denied
  const header = request.headers.get('authorization') ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : header;
  return token === key;
}

// ── Schema ───────────────────────────────────────────────────────────────────

const HackerSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  type: z.enum(HACKER_ADMISSION_TYPES as [HackerAdmissionType, ...HackerAdmissionType[]]),
});

const RequestSchema = z.object({
  hackers: z.array(HackerSchema).min(1),
  // Required only when the batch contains accept or waitlist_accept rows.
  rsvpListSlug: z.string().optional(),
  releaseIds: z.string().optional(),
});

// ── Result type ───────────────────────────────────────────────────────────────

interface HackerResult {
  firstName: string;
  lastName: string;
  email: string;
  type: HackerAdmissionType;
  titoUrl: string | null;
  hubUrl: string | null;
  success: boolean;
  notes: string | null;
}

// ── Concurrency ───────────────────────────────────────────────────────────────

const TITO_CONCURRENCY = 20;
const EMAIL_CONCURRENCY = 10;

// ── Handler ───────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues.map((i) => i.message).join('; ') },
      { status: 400 }
    );
  }

  const { hackers, rsvpListSlug = '', releaseIds = '' } = parsed.data;

  const needsTito = hackers.some((h) => admissionNeedsTitoAndHub(h.type));
  if (needsTito && !rsvpListSlug) {
    return NextResponse.json(
      {
        ok: false,
        error:
          'rsvpListSlug is required when the batch contains accept or waitlist_accept entries.',
      },
      { status: 400 }
    );
  }

  if (!DEFAULT_SENDER) {
    return NextResponse.json(
      { ok: false, error: 'Email configuration missing on server.' },
      { status: 500 }
    );
  }
  const sender = DEFAULT_SENDER;

  // Pre-fetch Tito map and Hub duplicate set once for the whole batch
  const [existingInvitationsMap, existingEmailSet] = await Promise.all([
    needsTito
      ? getAllRsvpInvitations(rsvpListSlug)
      : Promise.resolve(new Map<string, string>()),
    (async () => {
      const acceptEmails = hackers
        .filter((h) => admissionNeedsTitoAndHub(h.type))
        .map((h) => h.email);
      if (!acceptEmails.length) return new Set<string>();
      const res = await GetManyUsers({ email: { $in: acceptEmails } });
      return new Set<string>(
        res.ok ? res.body.map((u: { email: string }) => u.email) : []
      );
    })(),
  ]);

  const titoLimiter = createLimiter(TITO_CONCURRENCY);
  const emailLimiter = createLimiter(EMAIL_CONCURRENCY);

  const results: HackerResult[] = await Promise.all(
    hackers.map(async ({ firstName, lastName, email, type }) => {
      const base: Omit<HackerResult, 'titoUrl' | 'hubUrl' | 'success' | 'notes'> = {
        firstName,
        lastName,
        email,
        type,
      };

      const fail = (notes: string): HackerResult => ({
        ...base,
        titoUrl: null,
        hubUrl: null,
        success: false,
        notes,
      });

      if (admissionNeedsTitoAndHub(type)) {
        // Guard: already has a Hub account
        if (existingEmailSet.has(email)) {
          return fail('User already exists in Hub.');
        }

        // Tito invitation
        const titoResult = await titoLimiter(() =>
          getOrCreateTitoInvitation(
            { firstName, lastName, email, rsvpListSlug, releaseIds },
            existingInvitationsMap
          )
        );
        if (!titoResult.ok) return fail(titoResult.error ?? 'Tito invite failed.');

        // Hub invite link
        const invite = await GenerateInvite(
          { email, name: `${firstName} ${lastName}`, role: 'hacker' },
          'invite'
        );
        if (!invite.ok || !invite.body) {
          return fail(invite.error ?? 'Failed to generate Hub invite link.');
        }

        // Email
        const subject =
          type === 'waitlist_accept'
            ? HACKER_WAITLIST_ACCEPT_EMAIL_SUBJECT
            : HACKER_EMAIL_SUBJECT;
        const html =
          type === 'waitlist_accept'
            ? hackerWaitlistAcceptTemplate(firstName, titoResult.titoUrl, invite.body)
            : hackerInviteTemplate(firstName, titoResult.titoUrl, invite.body);

        try {
          await emailLimiter(() =>
            transporter.sendMail({ from: sender, to: email, subject, html })
          );
          return {
            ...base,
            titoUrl: titoResult.titoUrl,
            hubUrl: invite.body!,
            success: true,
            notes: null,
          };
        } catch (e) {
          return fail(`Email send failed: ${e instanceof Error ? e.message : 'Unknown error'}`);
        }
      } else {
        // Waitlist / reject — email only
        const subject =
          type === 'waitlist'
            ? HACKER_WAITLIST_EMAIL_SUBJECT
            : HACKER_REJECTION_EMAIL_SUBJECT;
        const html =
          type === 'waitlist'
            ? hackerWaitlistTemplate(firstName)
            : hackerRejectionTemplate(firstName);

        try {
          await emailLimiter(() =>
            transporter.sendMail({ from: sender, to: email, subject, html })
          );
          return { ...base, titoUrl: null, hubUrl: null, success: true, notes: null };
        } catch (e) {
          return fail(`Email send failed: ${e instanceof Error ? e.message : 'Unknown error'}`);
        }
      }
    })
  );

  const successCount = results.filter((r) => r.success).length;
  const failureCount = results.length - successCount;

  return NextResponse.json(
    { ok: failureCount === 0, results, successCount, failureCount },
    { status: 200 }
  );
}
