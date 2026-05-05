export const HACKER_EMAIL_SUBJECT =
  '[ACTION REQUIRED] Your Ticket to HackDavis 2026!';

export default function hackerInviteTemplate(
  fname: string,
  titoUrl: string,
  hubInviteUrl: string
) {
  const HEADER_IMAGE_URL = `${process.env.BASE_URL}/email/2026_header.png`;
  const FOOTER_IMAGE_URL = `${process.env.BASE_URL}/email/2026_footer.png`;
  const DISCORD_SERVER_URL = 'https://discord.gg/wc6QQEc';
  const CLAIM_TITO_TICKET_DEADLINE = 'May 6th, 11:59pm PDT';
  const DOE_DATE = 'May 9th, 2026';
  const DOE = 'May 9 - 10, 2026';
  const DOE_LOCATION = 'University Credit Union Center, UC Davis';

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${HACKER_EMAIL_SUBJECT}</title>
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
        <p style="color: #173a52; text-align: center; font-size: 14px;">✦ ${DOE}    ✦ ${DOE_LOCATION}</p>
        <div class="divider"></div>
        <div class="content-box">
            <p>Hi ${fname}, you're in!</p>
            <br/>
            <p>We can't wait to see the amazing ideas you’ll bring. Before you arrive, there are a few things you’ll need to complete. 💕</p>
            <p class="bold" style="color: #57dade;">COMPLETE BEFORE THE EVENT</p>
            <div class="bordered-section">
              <p class="bold">1️⃣ Claim your Ticket by ${CLAIM_TITO_TICKET_DEADLINE}</p>
              <p>You must claim a ticket to attend — no ticket, no entry. Check in on your friends too and make sure everyone has theirs. </p>
              <p>👉 Tito Ticket: <a href="${titoUrl}">${titoUrl}</a></p>
              <p class="special-note">Do NOT share your unique link with anyone else.</p>
            </div>
            <div class="bordered-section">
              <p class="bold">2️⃣ Create a HackDavis Hub Account by ${DOE_DATE}</p>
              <p>HackDavis Hub is where you'll find exciting information like prizes, workshops, starter kit, demo tips, live judging info and more!</p>
              <p>👉 Hub Invite: <a href="${hubInviteUrl}">${hubInviteUrl}</a></p>
              <p class="special-note">Use this unique link to create your account. Do NOT share it with anyone else.</p>
            </div>
            <div class="bordered-section">
              <p class="bold">3️⃣ Join our Discord server</p>
              <p>All event communication happens here. After joining, follow <span class="bold">#read-me-first</span> to get your Hacker role and unlock day-of channels.</p>
              <p>👉 Discord Server: <a href="${DISCORD_SERVER_URL}">${DISCORD_SERVER_URL}</a></p>
            </div>
            <p>Please feel free to reach out if you have any questions or concerns. We can't wait to see what you build!</p>
            <br/>
            <p style="margin-bottom: 0;">Thank you,<br/>The HackDavis Team</p>
        </div>
        <div class="divider"></div>
        <img src="${FOOTER_IMAGE_URL}" alt="HackDavis 2026 footer" class="footer-image">
    </div>
</body>
</html>`;
}
