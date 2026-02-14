export default function mentorInviteTemplate(fname: string, titoUrl: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mentor Invitation - HackDavis 2025</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #ffffff;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
        }
        .header-image {
            width: 100%;
            height: auto;
            display: block;
        }
        .title {
            text-align: center;
            font-size: 32px;
            font-weight: bold;
            margin: 30px 0;
            color: #000000;
        }
        .content-box {
            background-color: #EDEDED;
            padding: 40px;
            margin: 20px 0;
            border-radius: 8px;
        }
        .content-box p {
            font-size: 16px;
            line-height: 1.6;
            color: #222222;
            margin: 0 0 16px 0;
        }
        .content-box a {
            color: #0061FE;
            text-decoration: none;
        }
        .content-box a:hover {
            text-decoration: underline;
        }
        .content-box ul {
            margin: 16px 0;
            padding-left: 20px;
        }
        .content-box li {
            font-size: 16px;
            line-height: 1.6;
            color: #222222;
            margin-bottom: 12px;
        }
        .content-box ul ul {
            margin-top: 8px;
        }
        .highlight {
            font-weight: bold;
        }
        .divider {
            height: 2px;
            background-color: #000000;
            margin: 40px 0;
        }
        .footer-image {
            width: 100%;
            height: auto;
            display: block;
            margin-top: 20px;
        }
        @media only screen and (max-width: 600px) {
            .content-box {
                padding: 24px;
                margin: 10px;
            }
            .title {
                font-size: 24px;
                margin: 20px 0;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header Image -->
        <img src="https://mcusercontent.com/fe699c33d6f250fd347f8009c/images/c65cff0f-518c-aa28-a54c-4bf2d9fb1caf.png" alt="HackDavis 2025 Ticket" class="header-image">

        <!-- Title -->
        <h1 class="title">Congratulations from HackDavis! 🎉</h1>

        <!-- Content Box -->
        <div class="content-box">
            <p>Hi ${fname},</p>

            <p>We are thrilled to welcome you as a <span class="highlight">mentor</span> at HackDavis 2025! We can't wait to see all the guidance and support you'll bring to our hackers. HackDavis 2025 will take place on April 19th - 20th, 2025 completely in-person at the University Credit Union Center @ UC Davis. 💗💻🍃</p>

            <p>Please read this email carefully and complete all tasks for a smooth experience.</p>

            <p class="highlight">Here's what we need from you:</p>

            <ul>
                <li><span class="highlight">Claim your mentor ticket by April 10th, 11:59 PM PDT here:</span> <a href="${titoUrl}">${titoUrl}</a>
                    <ul>
                        <li><span class="highlight">You MUST claim a ticket to attend the event</span></li>
                    </ul>
                </li>
                <li><span class="highlight">Join our Discord</span> at <a href="https://discord.gg/wc6QQEc">https://discord.gg/wc6QQEc</a>. This is where all communication will take place during the hackathon!
                    <ul>
                        <li>To gain access to mentor channels, please follow the instructions in <em>#❗️read-me-first❗️</em>.</li>
                    </ul>
                </li>
            </ul>

            <p>After claiming your ticket using the link above, <span class="highlight">you will receive a unique QR Code</span> which you will use to check-in at the venue on Saturday April 19th.</p>

            <p>Be sure to follow our Instagram at <span class="highlight">@hackdavis</span> to stay updated! We will send out logistical details closer to the event.</p>

            <p>If you have any questions, concerns, or comments, please reach out to <a href="mailto:hello@hackdavis.io">hello@hackdavis.io</a>.</p>

            <p>See ya soon! ✨</p>

            <p style="margin-bottom: 0;">The HackDavis Team</p>
        </div>

        <!-- Divider -->
        <div class="divider"></div>

        <!-- Footer Image -->
        <img src="https://mcusercontent.com/fe699c33d6f250fd347f8009c/images/c65cff0f-518c-aa28-a54c-4bf2d9fb1caf.png" alt="HackDavis 2025 Ticket" class="footer-image">
    </div>
</body>
</html>`;
}
