export const HACKER_REJECTION_EMAIL_SUBJECT =
  'HackDavis 2026 — Application Update';

export default function hackerRejectionTemplate(fname: string) {
  const HEADER_IMAGE_URL = `${process.env.BASE_URL}/email/2026_header.png`;
  const FOOTER_IMAGE_URL = `${process.env.BASE_URL}/email/2026_footer.png`;
  const DOE = 'May 9 - 10, 2026';
  const DOE_LOCATION = 'University Credit Union Center, UC Davis';

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${HACKER_REJECTION_EMAIL_SUBJECT}</title>
    <style>
        body { margin: 0; padding: 0; font-family: 'DM Mono', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #ffffff; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header-image { width: 100%; height: auto; display: block; }
        .title { text-align: center; font-size: 28px; font-weight: bold; margin: 30px 0; color: #000000; }
        .content-box { background-color: #ffffff; margin: 20px 0; }
        .content-box p { font-size: 16px; line-height: 1.6; color: #222222; margin: 0 0 16px 0; }
        .content-box a { color: #0061FE; text-decoration: none; }
        .content-box a:hover { text-decoration: underline; }
        .bold { font-weight: bold; }
        .divider { height: 2px; background-color: #F2F2F2; margin: 40px 0; }
        .footer-image { width: 100%; height: auto; display: block; margin-top: 20px; }
        @media only screen and (max-width: 600px) {
            .content-box { padding: 24px; margin: 10px; }
            .title { font-size: 24px; margin: 20px 0; }
        }
    </style>
</head>
<body>
    <div class="container">
        <img src="${HEADER_IMAGE_URL}" alt="HackDavis 2026 header" class="header-image">
        <h1 class="title">
          <span style="color: #173a52;">HackDavis 2026 — </span>
          <span style="color: #57dade;">Application Update</span>
        </h1>
        <p style="color: #173a52; text-align: center; font-size: 14px;">✦ ${DOE}    ✦ ${DOE_LOCATION}</p>
        <div class="divider"></div>
        <div class="content-box">
            <p>Hi ${fname},</p>
            <br/>
            <p>Thank you for applying to <span class="bold">HackDavis 2026</span> — California's largest social good hackathon. We truly appreciate the time and effort you put into your application.</p>
            <p>After careful review, we're sorry to let you know that we're unable to offer you a spot at HackDavis 2026. We received an overwhelming number of applications this year, and the decisions were incredibly difficult.</p>
            <p>We hope this doesn't discourage you — the hackathon community is always growing, and we'd love to see you apply again in the future. Keep building!</p>
            <p>If you have any questions, feel free to reply to this email.</p>
            <br/>
            <p style="margin-bottom: 0;">Thank you,<br/>The HackDavis Team</p>
        </div>
        <div class="divider"></div>
        <img src="${FOOTER_IMAGE_URL}" alt="HackDavis 2026 footer" class="footer-image">
    </div>
</body>
</html>`;
}
