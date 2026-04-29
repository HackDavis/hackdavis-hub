export const JUDGE_EMAIL_SUBJECT =
  '[ACTION REQUIRED] HackDavis 2026 Judging App Invite';

export default function judgeHubInviteTemplate(
  fname: string,
  inviteLink: string
) {
  const HEADER_IMAGE_URL = `${process.env.BASE_URL}/email/2026_header.png`;
  const FOOTER_IMAGE_URL = `${process.env.BASE_URL}/email/2026_footer.png`;
  const JUDGE_ORIENTATION_SLIDES =
    'https://docs.google.com/presentation/d/1UwKKN48FGZMDWg2gS5_RKATjMqBuUjdWmL04lKKqw3o/edit?usp=sharing';
  const JUDGING_GUIDE =
    'https://docs.google.com/document/d/1auzgbrT0KquoaTTAVGtKuc6afH4pfyfJvS9zJbpS5JM/edit?usp=sharing';
  const WELCOME_TO_THE_JUDGING_APP_SLIDE =
    'https://docs.google.com/presentation/d/1UwKKN48FGZMDWg2gS5_RKATjMqBuUjdWmL04lKKqw3o/edit?slide=id.g3dcbf5edc7b_0_200#slide=id.g3dcbf5edc7b_0_200';
  const DISCORD_SERVER_URL = 'https://discord.gg/wc6QQEc';
  const DOE = 'May 9 - 10, 2026';
  const DOE_LOCATION = 'University Credit Union Center, UC Davis';

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${JUDGE_EMAIL_SUBJECT}</title>
    <style>
        body { margin: 0; padding: 0; font-family: 'DM Mono', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #ffffff; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header-image { width: 100%; height: auto; display: block; }
        .title { text-align: center; font-size: 28px; font-weight: bold; margin: 30px 0; color: #000000; }
        .content-box { background-color: #ffffff; margin: 20px 0; }
        .content-box p { font-size: 16px; line-height: 1.5; color: #222222; margin: 0 0 16px 0; }
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
            <p>Thank you again for joining us as a <span class="bold">judge</span>, we’re thrilled to have you on board! Here are some key resources from our virtual orientation:</p>
            <p>🔹 Judge Orientation Slides: <a href="${JUDGE_ORIENTATION_SLIDES}">${JUDGE_ORIENTATION_SLIDES}</a></p>
            <p>🔹 Judging Guide: <a href="${JUDGING_GUIDE}">${JUDGING_GUIDE}</a></p>
            <p class="special-note">You are requested to carefully review the judging guide + orientation slides and familiarize yourself with its content before the event for a smooth judging experience. <span class="bold"><u>Kindly do not share the Judging Guide with anyone outside the judging team.</u></span></p>
            <div class="bordered-section">
              <p class="bold">IMPORTANT NEXT STEP: Create an account on our Judging Application</p>
              <p>⚠️ The Judging Application is a key prerequisite for the day of the event! Please carefully review the <a href="${WELCOME_TO_THE_JUDGING_APP_SLIDE}">Welcome to the Judging App</a> slide from our virtual Judge Orientation before proceeding to create your account.</p>
              <p>👉 Invite Link: <a href="${inviteLink}">${inviteLink}</a></p>
              <p class="special-note">Please use this unique invite link below to create your judge account. <u>Do NOT share it with anyone else.</u></p>
            </div>
            <div class="bordered-section">
              <p class="bold">OPTIONAL: Join our Discord</p>
              <p>👉 Discord Server: <a href="${DISCORD_SERVER_URL}">${DISCORD_SERVER_URL}</a></p>
              <p>We’ll be using Discord server as our main space for announcements and support during the event. Joining is totally optional for judges, but it’s a great way to:</p>
              <p>🔹 Get quick answers from the team</p>
              <p>🔹 Stay in the loop on event updates</p>
              <p>🔹 Connect with other judges & participants</p>
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
