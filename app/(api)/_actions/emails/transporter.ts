import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

// Read at import time so callers can do `if (!DEFAULT_SENDER)` guards.
// Does NOT throw — callers handle the missing case themselves.
export const DEFAULT_SENDER = process.env.SENDER_EMAIL ?? null;

let _transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (_transporter) return _transporter;

  const email = process.env.SENDER_EMAIL;
  const pwd = process.env.SENDER_PWD;
  const missing = [!email && 'SENDER_EMAIL', !pwd && 'SENDER_PWD'].filter(
    Boolean
  );
  if (missing.length > 0) {
    throw new Error(
      `Email transporter: missing environment variable(s): ${missing.join(
        ', '
      )}`
    );
  }

  _transporter = nodemailer.createTransport({
    service: 'gmail',
    pool: true,
    maxConnections: 10,
    maxMessages: Infinity,
    auth: { user: email!, pass: pwd! },
  });

  return _transporter;
}

// Thin proxy so callers don't need to change — sendMail initialises the
// real transport on first use rather than at module load time.
export const transporter = {
  sendMail: (options: nodemailer.SendMailOptions) =>
    getTransporter().sendMail(options),
};
