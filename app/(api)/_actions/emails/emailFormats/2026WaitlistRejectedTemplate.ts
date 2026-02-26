export default function waitlistRejectedTemplate(fname: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Update from HackDavis</title>
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
        <h1 class="title">Update from HackDavis</h1>

        <!-- Content Box -->
        <div class="content-box">
            <p>Hi ${fname},</p>

            <p>Thank you so much for your interest in HackDavis 2025, we truly appreciate your enthusiasm and patience throughout this process.</p>

            <p>Unfortunately, due to overwhelming interest and limited capacity, we're no longer able to accommodate hackers currently on the waitlist. We know this is disappointing, and we're just as bummed as you are.</p>

            <p>If you have any questions, feel free to reach out to us at <a href="mailto:hello@hackdavis.io">hello@hackdavis.io</a>. You're part of what makes our community so special, and we hope to see you at HackDavis 2026! 💙</p>

            <p>Warmly,</p>

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
