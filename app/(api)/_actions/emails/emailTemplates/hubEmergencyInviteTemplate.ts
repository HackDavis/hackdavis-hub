export default function hubEmergencyInviteTemplate(link: string) {
  const HEADER_IMAGE_URL = `${process.env.BASE_URL}/email/2025_email_header.png`;
  return `
	<!DOCTYPE html>
		<html lang="en">
		<head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
		    <title>HackDavis Hub Invite Link</title>
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
                <img src="${HEADER_IMAGE_URL}" alt="HackDavis 2025 header" class="header-image">
                <h1 class="title">
                    <span style="color: #173a52;">Invitation to the </span>
                    <span style="color: #57dade;">HackDavis Hub</span>
                </h1>
                <div class="divider"></div>
                <div class="content-box">
                    <p>Click the link below to create your account on the HackDavis Hub. Do <span class="bold">NOT</span> share this unique invite link with anyone.</p>
                    <p><a href="${link}" style="font-size: 14px;">${link}</a></p>
                </div>
            </div>
		</body>
		</html>
	`;
}
