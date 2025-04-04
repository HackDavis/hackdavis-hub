export default function emailMessage(type: string, link: string) {
  const inviteMsg = `
    <!DOCTYPE html>
    <html>
    <head>
    <title>HackDavis Hub Invite Link</title>
    <style>
    * {
      box-sizing: border-box;
      color: white;
      text-decoration: none;
    }
    
    .container {
      background-color: #173A52;
      width: 100%;
      padding: 48px;
    }
    
    .welcome-text {
      color: white;
      font-size: 1.5rem;
      font-weight: 700;
      font-family: 'Helvetica';
    }
    
    .name-text {
      color: #76D6E6;
      font-family: 'Helvetica';
    }
    
    .make-account {
      color: white;
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
      font-family: 'Proxima Nova';
      font-size: 1.25rem;
      color: #173a52;
      cursor: pointer;
      text-align: center;
      text-decoration: none;
      font-family: 'Helvetica';
    }
    
    .bottom-text {
      color: white;
      font-family: 'Helvetica';
    }
    
    
    </style>
    </head>
    <body>
    <div class="container">
      <h3 class="welcome-text">Invitation to the HackDavis Hub</h3>
      <p class="make-account">
        Please create your account for the HackDavis Hub using the following invite
        link. Do <span>NOT</span> share this link with anyone.
      </p>
      <a class="button" href="${link}">Register for the Hub</a>
      <div>
        <p class="bottom-text">Your invite link is:</p>
        <p class="bottom-text">${link}</p>
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
      color: white;
      text-decoration: none;
    }
    
    .container {
      background-color: #173A52;
      width: 100%;
      padding: 48px;
    }
    
    .welcome-text {
      color: white;
      font-size: 1.5rem;
      font-weight: 700;
      font-family: 'Helvetica';
    }
    
    .name-text {
      color: #76D6E6;
      font-family: 'Helvetica';
    }
    
    .make-account {
      color: white;
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
      font-family: 'Proxima Nova';
      font-size: 1.25rem;
      color: #173a52;
      cursor: pointer;
      text-align: center;
      text-decoration: none;
      font-family: 'Helvetica';
    }
    
    .bottom-text {
      color: white;
      font-family: 'Helvetica';
    }
    
    
    </style>
    </head>
    <body>
    <div class="container">
      <h3 class="welcome-text">Reset Password Request for the HackDavis Hub</h3>
      <p class="make-account">
        Please reset your password for the HackDavis Hub using the following invite
        link. Do <span>NOT</span> share this link with anyone. If you didn't request
        a password reset, you can safely ignore this email.
      </p>
      <a class="button" href="${link}">Reset Password</a>
      <div>
        <p class="bottom-text">Your reset password link is:</p>
        <p class="bottom-text">${link}</p>
      </div>
     </div>
    </body>
    </html>
    `;

  return type === 'invite' ? inviteMsg : resetMsg;
}
