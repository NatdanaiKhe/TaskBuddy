import { Resend } from "resend";
const resend = new Resend(process.env.EMAIL_API_KEY || "");
const EMAIL = process.env.EMAIL;

const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const response = await resend.emails.send({
      from: `Task Buddy <${EMAIL}>`,
      to: [to],
      subject: subject,
      html: html,
    });
    return response;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

const sendVerificationEmail = async (email: string, token: string) => {
  const link = process.env.FRONTEND_URL + "/verify-email?token=" + token;
  const html = `<body><style>@import url(https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Kanit:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap);*{font-family:Kanit,sans-serif}.email-wrapper{width:500px}.button{padding:10px 20px;background-color:#155dfc;border-radius:10px;color:#fff;cursor:pointer}</style><div class=email-wrapper><h1>Please Verify Your Email</h1><p>Welcome to Task Buddy<br>Please verify your email. Doing this will unlock features and ensure your account doesn't get lost.</p><a href='${link}' class=button>Verify my email</a></div>`;

  await sendEmail(email, "Email Verification For Task Buddy", html);
};

const sendResetPasswordEmail = async (email: string, token: string) => {
  const link = process.env.FRONTEND_URL + "/reset-password?token=" + token;
  const html = `<body><style>@import url(https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Kanit:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap);*{font-family:Kanit,sans-serif}.email-wrapper{width:500px}.button{padding:10px 20px;background-color:#155dfc;border-radius:10px;color:#fff;cursor:pointer}</style><div class=email-wrapper><h1>Password Reset</h1>There was recently a request to change the password on your account.</p><a href='${link}' class=button>Reset Password</a></div>`;
  await sendEmail(email, "Password Reset For Task Buddy", html);
};
export { sendEmail, sendVerificationEmail, sendResetPasswordEmail };
