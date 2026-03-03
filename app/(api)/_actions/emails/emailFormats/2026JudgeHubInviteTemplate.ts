export default function judgeHubInviteTemplate(
  fname: string,
  inviteLink: string
) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Judge Invitation - HackDavis 2026</title>
    <style>
        body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #ffffff; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header-image { width: 100%; height: auto; display: block; }
        .title { text-align: center; font-size: 32px; font-weight: bold; margin: 30px 0; color: #000000; }
        .content-box { background-color: #EDEDED; padding: 40px; margin: 20px 0; border-radius: 8px; }
        .content-box p { font-size: 16px; line-height: 1.6; color: #222222; margin: 0 0 16px 0; }
        .content-box a { color: #0061FE; text-decoration: none; }
        .content-box a:hover { text-decoration: underline; }
        .content-box ul { margin: 16px 0; padding-left: 20px; }
        .content-box li { font-size: 16px; line-height: 1.6; color: #222222; margin-bottom: 12px; }
        .content-box ul ul { margin-top: 8px; }
        .highlight { font-weight: bold; }
        .button { display: inline-block; background-color: #FFC53D; color: #173a52; font-weight: 600; font-size: 16px; padding: 14px 32px; border-radius: 6px; text-decoration: none; margin: 8px 0 16px; }
        .divider { height: 2px; background-color: #000000; margin: 40px 0; }
        .footer-image { width: 100%; height: auto; display: block; margin-top: 20px; }
        @media only screen and (max-width: 600px) {
            .content-box { padding: 24px; margin: 10px; }
            .title { font-size: 24px; margin: 20px 0; }
        }
    </style>
</head>
<body>
    <div class="container">
        <img src="${process.env.BASE_URL}/email/2025_email_header.png" alt="HackDavis 2026" class="header-image">
        <h1 class="title">Welcome to HackDavis 2026! 🎉</h1>
        <div class="content-box">
            <p>Hi ${fname},</p>
            <p>We are thrilled to welcome you as a <span class="highlight">judge</span> at HackDavis 2026! We're excited to have your expertise help our hackers bring their ideas to life.</p>
            <p class="highlight">Here's what you need to do:</p>
            <ul>
                <li>
                    <span class="highlight">Create your HackDavis Hub account by clicking the button below:</span>
                    <ul><li><span class="highlight">This link is unique to you — do NOT share it with anyone.</span></li></ul>
                </li>
                <li>
                    <span class="highlight">Join our Discord</span> at <a href="https://discord.gg/wc6QQEc">https://discord.gg/wc6QQEc</a> to stay up to date with event details.
                </li>
            </ul>
            <a href="${inviteLink}" class="button">Create Your Hub Account</a>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p><a href="${inviteLink}">${inviteLink}</a></p>
            <p>See you at HackDavis! ✨</p>
            <p style="margin-bottom: 0;">The HackDavis Team</p>
        </div>
        <div class="divider"></div>
        <img src="${process.env.BASE_URL}/email/2025_email_header.png" alt="HackDavis 2026" class="footer-image">
    </div>
</body>
</html>`;
}
