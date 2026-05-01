export const MENTOR_EMAIL_SUBJECT =
  '[ACTION REQUIRED] HackDavis 2026 Mentor Invite';

export default function mentorInviteTemplate(fname: string, titoUrl: string) {
  const HEADER_IMAGE_URL = `${process.env.BASE_URL}/email/2026_header.png`;
  const FOOTER_IMAGE_URL = `${process.env.BASE_URL}/email/2026_footer.png`;
  const DISCORD_SERVER_URL = 'https://discord.gg/wc6QQEc';
  const MENTOR_GUIDE =
    'https://www.notion.so/hackdavis/HackDavis-Mentor-Guide-3512d37fcae880c2916ff83fcde19565?source=copy_link';
  const CLAIM_TITO_TICKET_DEADLINE = '11:59pm on May 4th';
  const DOE_DATE = 'May 9th, 2026';
  const TECH_DIRECTOR = 'Afifah';
  const EXTERNAL_DIRECTOR = 'Kelly';
  const DOE = 'May 9 - 10, 2026';
  const DOE_LOCATION = 'University Credit Union Center, UC Davis';

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${MENTOR_EMAIL_SUBJECT}</title>
    <style>
        body { margin: 0; padding: 0; font-family: 'DM Mono', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #ffffff; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header-image { width: 100%; height: auto; display: block; }
        .title { text-align: center; font-size: 28px; font-weight: bold; margin: 30px 0; color: #000000; }
        .content-box { background-color: #ffffff; margin: 20px 0; }
        .content-box p { font-size: 16px; line-height: 1.6; color: #222222; margin: 0 0 16px 0; }
        .content-box a { color: #0061FE; text-decoration: none; }
        .content-box a:hover { text-decoration: underline; }
        .content-box ul { margin: 16px 0; padding-left: 20px; }
        .content-box li { font-size: 16px; line-height: 1.6; color: #222222; margin-bottom: 12px; }
        .content-box ul ul { margin-top: 8px; }
        .content-box p.special-note { font-size: 14px; color: #8d9ca2; }
        .bordered-section { border-width: 2px; border-style: solid; border-color: #e5e5e5; border-radius: 5px; padding: 12px 24px; margin: 16px 0; }
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
          <span style="color: #173a52;">Welcome to </span>
          <span style="color: #57dade;">HackDavis 2026!</span>
        </h1>
        <p style="color: #173a52; text-align: center; font-size: 14px; ">✦ ${DOE}    ✦ ${DOE_LOCATION}</p>
        <div class="divider"></div>
        <div class="content-box">
            <p>Hi ${fname},</p>
            <br/>
            <p>Thank you again for joining us as a <span class="bold">mentor</span>, we’re thrilled to have you on board! Here is an important resource for you:</p>
            <p>🔹 Mentor Guide: <a href="${MENTOR_GUIDE}">${MENTOR_GUIDE}</a></p>
            <p class="special-note">Please read through the Mentor Guide and ensure you are familiar with the <span class="bold">expectations and responsibilities</span> of a mentor and the <span class="bold">Discord bot</span> you will be interacting with during your shift.</p>
            <p class="bold">Shift assignments have been emailed to you already, kindly mark your calendars!</p>
            <p class="bold" style="color: #57dade;">IMPORTANT NEXT STEPS:</p>
            <div class="bordered-section">
              <p class="bold">1️⃣ Claim your E-Ticket here by ${CLAIM_TITO_TICKET_DEADLINE}</p>
              <p>👉 Tito Ticket: <a href="${titoUrl}">${titoUrl}</a></p>
              <p class="special-note">Please use this unique invite link to claim your e-ticket. Do NOT share it with anyone else. <u>You will be asked to show your e-ticket at the check-in table to receive your mentor shirts and nametags and to enter the venue.</u></p>
            </div>
            <div class="bordered-section">
              <p class="bold">2️⃣ Join our Discord server by ${DOE_DATE}</p>
              <p>👉 Discord Server: <a href="${DISCORD_SERVER_URL}">${DISCORD_SERVER_URL}</a></p>
              <p>⚠️ Once you join, DM the user "<i>${EXTERNAL_DIRECTOR} [DIRECTOR]</i>" or "<i>${TECH_DIRECTOR} [DIRECTOR]</i>" with your full name to request the Mentor role in the server.</p>
              <p>We’ll be using Discord server as our main space for announcements and support for all attendees during the event. You can use it to:</p>
              <p>🔹 Get quick answers from the team</p>
              <p>🔹 Stay in the loop on event updates</p>
              <p>🔹 Connect with other mentors & participants</p>
              <p class="special-note">You will be <u>monitoring the Discord for incoming mentor-request tickets</u> from hackers during your shift. Hence, it is necessary that you receive the Mentor role by <span class="bold">${DOE_DATE}</span>.</p>
            </div>
            <p>Please feel free to reach out if you have any questions or concerns. Looking forward to seeing you at the event!</p>
            <br/>
            <p style="margin-bottom: 0;">Thank you,<br/>The HackDavis Team</p>
        </div>
        <div class="divider"></div>
        <img src="${FOOTER_IMAGE_URL}" alt="HackDavis 2026 footer" class="footer-image">
    </div>
</body>
</html>`;
}
