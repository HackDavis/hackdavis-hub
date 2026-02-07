export default function waitlistedTemplate(fname: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HackDavis 2025 Application Update</title>
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
        <h1 class="title">Update from HackDavis 🌊</h1>

        <!-- Content Box -->
        <div class="content-box">
            <p>Hi ${fname},</p>

            <p>Thank you for applying to HackDavis 2025! Unfortunately, due to a high volume of applications, you have been <span class="highlight">waitlisted</span> for HackDavis 2025.</p>

            <p>We are unable to offer you a spot at the moment, but there is still a possibility of spots opening up later. Just hang in there, we will get back to you about a change in your status as soon as possible.</p>

            <p>If you have any questions, concerns, or comments, please reach out to <a href="mailto:hello@hackdavis.io">hello@hackdavis.io</a>.</p>

            <p style="margin-bottom: 0;">Warmly,<br>The HackDavis Team</p>
        </div>

        <!-- Divider -->
        <div class="divider"></div>

        <!-- Footer Image -->
        <img src="https://mcusercontent.com/fe699c33d6f250fd347f8009c/images/c65cff0f-518c-aa28-a54c-4bf2d9fb1caf.png" alt="HackDavis 2025 Ticket" class="footer-image">
    </div>
</body>
</html>`;
}
