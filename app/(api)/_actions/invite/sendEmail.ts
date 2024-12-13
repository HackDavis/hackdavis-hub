'use server';

import nodemailer from 'nodemailer';
import FormToJSON from '@utils/form/FormToJSON';
import { generateHMACSignature } from '@utils/invite/hmac';
import { HttpError } from '@utils/response/Errors';

const senderEmail = process.env.SENDER_EMAIL;
const password = process.env.SENDER_PWD;

interface Response {
  ok: boolean;
  body: string | null;
  error: string | null;
}

export default async function sendEmail(
  prevState: any,
  formData: FormData
): Promise<Response> {
  try {
    const data = FormToJSON(formData);
    data['exp'] =
      Date.now() +
      1000 * 60 * (parseInt(process.env.INVITE_TIMEOUT as string) ?? 30);
    const data_encoded = btoa(JSON.stringify(data));

    const hmac_sig = generateHMACSignature(data_encoded);
    const hmac_url = `${process.env.BASE_URL}/judges${data.slug}?data=${data_encoded}&sig=${hmac_sig}`;

    const { name, email } = data;

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
      <h3 class="welcome-text">Welcome to HackDavis Judging,</h3>
      <h3 class="name-text">${name}</h3>
      <p class="make-account">
        Please make an account on our Judging Portal with the following invite
        link. Do <span>NOT</span> share this link
        with anyone.
      </p>
      <a class="button" href="${hmac_url}">Register</a>
      <div>
        <p class="bottom-text">Your invite link is:</p>
        <p class="bottom-text">${hmac_url}</p>
      </div>
     </div>
    </body>
    </html>
    `;
    const mailOptions = {
      from: `${name} <${senderEmail}>`,
      to: email,
      subject: `HackDavis Judging App Invite`,
      replyTo: email,
      html: msg,
    };

    const output = await new Promise<Response>((resolve, _) => {
      transporter.sendMail(mailOptions, function (error, _) {
        if (error) {
          resolve({ ok: false, body: null, error: error.message });
        } else {
          resolve({ ok: true, body: hmac_url, error: null });
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
