import { Resend } from "resend";
const resend = new Resend(process.env.EMAIL_API_KEY || "");

const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const response = await resend.emails.send({
      from: "",
      to: to,
      subject: subject,
      html: html,
    });
    return response;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};
export { sendEmail };
