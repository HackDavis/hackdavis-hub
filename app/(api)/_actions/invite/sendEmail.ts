'use server';

import nodemailer from 'nodemailer';
import InviteData from '@typeDefs/inviteData';
import GenerateInvite from '@datalib/invite/generateInvite';
import {
  DuplicateError,
  HttpError,
  NotFoundError,
} from '@utils/response/Errors';
import { GetManyUsers } from '@datalib/users/getUser';
import emailMessage from './emailMessage';

const senderEmail = process.env.SENDER_EMAIL;
const password = process.env.SENDER_PWD;

interface Response {
  ok: boolean;
  body: string | null;
  error: string | null;
}

export default async function sendEmail(
  data: InviteData,
  type: string = 'invite'
): Promise<Response> {
  try {
    const users = await GetManyUsers({
      email: data.email,
    });

    if (type === 'reset' && (!users.ok || users.body.length === 0)) {
      throw new NotFoundError(`User with email ${data.email} not found.`);
    }

    if (type === 'invite' && users.ok && users.body.length !== 0) {
      throw new DuplicateError(`User with email ${data.email} already exists.`);
    }

    const invite = await GenerateInvite(data, type);

    if (!invite.ok) {
      throw new HttpError(invite.error ?? 'Failed to generate invite.');
    }

    const invite_link = invite.body;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: senderEmail,
        pass: password,
      },
    });

    const mailOptions = {
      from: senderEmail,
      to: data.email,
      subject:
        type === 'invite'
          ? 'HackDavis Hub Invite Link'
          : 'HackDavis Hub Password Reset Link',
      replyTo: data.email,
      html: emailMessage(type, invite_link ?? ''),
    };

    const output = await new Promise<Response>((resolve, _) => {
      transporter.sendMail(mailOptions, function (error, _) {
        if (error) {
          resolve({ ok: false, body: null, error: error.message });
        } else {
          resolve({ ok: true, body: invite_link, error: null });
        }
      });
    });
    return output;
  } catch (e) {
    const error = e as HttpError;
    return {
      ok: false,
      body: null,
      error: error.message,
    };
  }
}
