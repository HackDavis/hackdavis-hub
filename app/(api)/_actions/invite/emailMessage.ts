export default function emailMessage(type: string, link: string) {
  const inviteMsg = `
    <!DOCTYPE html>
    <html>
    <head>
    <title>HackDavis Hub Invite Link</title>
    <style>
    * {
      box-sizing: border-box;
      text-decoration: none;
    }
    
    .container {
      background-color: #E5EEF1;
      width: 100%;
      padding: 48px;
    }
    
    .welcome-text {
      color: black;
      font-size: 1.5rem;
      font-weight: 700;
      font-family: 'Helvetica';
    }
    
    .make-account {
      color: black;
      font-family: 'Helvetica';
      margin-bottom: 30px;
    }
    
    span {
      font-weight: 700;
    }
    
    .button {
      border: none;
      border-radius: 4px;
      padding: 12px;
      background-color: #FFC53D;
      font-weight: 500;
      font-size: 1.25rem;
      cursor: pointer;
      text-align: center;
      text-decoration: none;
      font-family: 'Helvetica';
    }

    .sub-container {
      margin-top: 30px;
    }
    
    .bottom-text {
      font-family: 'Helvetica';
    }

    .link {
      color: blue;
      font-family: 'Helvetica';
      text-decoration: underline;
    }
    
    </style>
    </head>
    <body>
    <div class="container">
      <h3 class="welcome-text">Invitation to the HackDavis Hub</h3>
      <p class="make-account">
        Click the button below to create your account on the HackDavis Hub. This link expires in 14 days. Do <span>NOT</span> share this unique invite link with anyone.
      </p>
      <a class="button" href="${link}">Register</a>
      <div class="sub-container">
        <p class="bottom-text">If you're having trouble with the above button, copy and paste the following link into your browser:</p>
        <p class="link">${link}</p>
      </div>
    </div>
    </body>
    </html>
    `;

  const resetMsg = `
    <!DOCTYPE html>
    <html>
    <head>
    <title>HackDavis Hub Reset Password Link</title>
    <style>
    * {
      box-sizing: border-box;
      text-decoration: none;
    }
    
    .container {
      background-color: #E5EEF1;
      width: 100%;
      padding: 48px;
    }
    
    .welcome-text {
      color: black;
      font-size: 1.5rem;
      font-weight: 700;
      font-family: 'Helvetica';
    }

    .make-account {
      color: black;
      font-family: 'Helvetica';
      margin-bottom: 30px;
    }
    
    span {
      font-weight: 700;
    }
    
    .button {
      border: none;
      border-radius: 4px;
      padding: 12px;
      background-color: #FFC53D;
      font-weight: 500;
      font-size: 1.25rem;
      color: #173a52;
      cursor: pointer;
      text-align: center;
      text-decoration: none;
      font-family: 'Helvetica';
    }
    
    .sub-container {
      margin-top: 30px;
    }
    
    .bottom-text {
      font-family: 'Helvetica';
    }

    .link {
      color: blue;
      font-family: 'Helvetica';
      text-decoration: underline;
    }
    
    </style>
    </head>
    <body>
    <div class="container">
      <h3 class="welcome-text">Reset Password Link for the HackDavis Hub</h3>
      <p class="make-account">
        Click the button below to reset your password for the HackDavis Hub. This link expires in 24 hours. Do <span>NOT</span> share this link with anyone. If you didn't request a password reset, you can safely ignore this email.
      </p>
      <a class="button" href="${link}">Reset Password</a>
      <div class="sub-container">
        <p class="bottom-text">If you're having trouble with the above button, copy and paste the following link into your browser:</p>
        <p class="link">${link}</p>
      </div>
     </div>
    </body>
    </html>
    `;

  return type === "invite" ? inviteMsg : resetMsg;
}
