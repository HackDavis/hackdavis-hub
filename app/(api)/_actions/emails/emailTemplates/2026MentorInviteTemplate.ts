export const MENTOR_EMAIL_SUBJECT =
  '[ACTION REQUIRED] HackDavis 2026 Mentor Invite';

export default function mentorInviteTemplate(fname: string, titoUrl: string) {
  const HEADER_IMAGE_URL = `${process.env.BASE_URL}/email/2026_header.png`;
  const FOOTER_IMAGE_URL = `${process.env.BASE_URL}/email/2026_footer.png`;
  const DISCORD_SERVER_URL = 'https://discord.gg/wc6QQEc';
  const MEETING_RECORDING_URL =
    'https://drive.google.com/file/d/1UjiSArmOvlMlkfOSh8xpoAjEov1j92xx/view?usp=sharing';
  const MENTOR_SLIDES_URL =
    'https://docs.google.com/presentation/d/1eBCl6OUdPhaR-eib8dXLaTHGFNqLR2ax4NFJqYtBBCw/edit?usp=sharing';
  const CLAIM_TITO_TICKET_DEADLINE = '11:59pm on May 4th';
  const DOE_DATE = 'May 9th, 2026';
  const TECH_LEAD_NAME = 'michelle';

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${MENTOR_EMAIL_SUBJECT}</title>
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
        .bold { font-weight: bold; }
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
        <img src="${HEADER_IMAGE_URL}" alt="HackDavis 2026 header" class="header-image">
        <h1 class="title">Congratulations from HackDavis! 🎉</h1>
        <div class="content-box">
            <p>Hi ${fname},</p>
            <br/>
            <p>Thank you again for joining us as a <span class="bold">mentor</span>, we’re thrilled to have you on board! Here are some key resources from our virtual orientation:</p>
            <p>🔹 Meeting Recording: <a href="${MEETING_RECORDING_URL}">${MEETING_RECORDING_URL}</a></p>
            <p>🔹 Slides: <a href="${MENTOR_SLIDES_URL}">${MENTOR_SLIDES_URL}</a></p>
            <p>If you were unable to attend the orientation, please ensure you watch the recording before the day of the event to familiarize yourself with the expectations and responsibilities of a mentor and with the Discord bot you will need to use during your shift. Shift assignments have been emailed to you already, kindly mark your calendars!</p>
            <br/>
            <p class="bold">IMPORTANT NEXT STEPS:</p>
            <p class="bold">1️⃣ Claim your E-Ticket here by ${CLAIM_TITO_TICKET_DEADLINE}</p>
            <p>👉 Tito Ticket: <a href="${titoUrl}">${titoUrl}</a></p>
            <p>Please use this unique invite link to claim your e-ticket. Do NOT share it with anyone else. You will be asked to show your e-ticket at the check-in table to receive your mentor shirts and nametags and to enter the venue.</p>
            <br/>
            <p class="bold">2️⃣ Join our Discord server</p>
            <p>👉 Discord Server: <a href="${DISCORD_SERVER_URL}">${DISCORD_SERVER_URL}</a></p>
            <p>Once you join, DM the user <i>${TECH_LEAD_NAME} [DIRECTOR]</i> with your full name to request the Mentor role in the server. As demonstrated during the orientation, you will be monitoring the Discord for incoming mentor-request tickets from hackers during your shift. Hence, it is necessary that you receive the Mentor role by <span class="bold">${DOE_DATE}</span>.</p>
            <p>We’ll be using Discord server as our main space for announcements and support for all attendees during the event. You can use it to:</p>
            <p>🔹 Get quick answers from the team</p>
            <p>🔹 Stay in the loop on event updates</p>
            <p>🔹 Connect with other mentors & participants</p>
            <br/>
            <p>Please feel free to reach out if you have any questions or concerns. Looking forward to seeing you at the event!</p>
            <br/>
            <p>Thank you,</p>
            <p style="margin-bottom: 0;">The HackDavis Team</p>
        </div>
        <div class="divider"></div>
        <img src="${FOOTER_IMAGE_URL}" alt="HackDavis 2026 footer" class="footer-image">
    </div>
</body>
</html>`;
}
