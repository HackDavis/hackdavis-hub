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

    const msg = `
    <!DOCTYPE html>
    <html>
    <head>
    <title>Page Title</title>
    <style>
    * {
      box-sizing: border-box;
      color: white;
      text-decoration: none;
    }
    
    .container {
      background-color: #173A52;
      width: 100%;
      padding: 48px;
    }
    
    .welcome-text {
      color: white;
      font-size: 1.5rem;
      font-weight: 700;
      font-family: 'Helvetica';
    }
    
    .name-text {
      color: #76D6E6;
      font-family: 'Helvetica';
    }
    
    .make-account {
      color: white;
      font-family: 'Helvetica';
      margin-bottom: 30px;
    }
    
    span {
      font-weight: 700;
    }
    
    .button {
      border: none;
      border-radius: 4px;
      padding: 12px;
      background-color: #FFC53D;
      font-weight: 500;
      font-family: 'Proxima Nova';
      font-size: 1.25rem;
      color: #173a52;
      cursor: pointer;
      text-align: center;
      text-decoration: none;
      font-family: 'Helvetica';
    }
    
    .bottom-text {
      color: white;
      font-family: 'Helvetica';
    }
    
    
    </style>
    </head>
    <body>
    <div class="container">
      <h3 class="welcome-text">Reset Password Request for the HackDavis Hub</h3>
      <p class="make-account">
        Please reset your password for the HackDavis Hub using the following invite
        link. Do <span>NOT</span> share this link with anyone. If you didn't request
        a password reset, you can safely ignore this email.
      </p>
      <a class="button" href="${invite_link}">Reset Password</a>
      <div>
        <p class="bottom-text">Your reset password link is:</p>
        <p class="bottom-text">${invite_link}</p>
      </div>
     </div>
    </body>
    </html>
    `;
    const mailOptions = {
      from: senderEmail,
      to: data.email,
      subject: `HackDavis Hub Password Reset Link`,
      replyTo: data.email,
      html: msg,
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
