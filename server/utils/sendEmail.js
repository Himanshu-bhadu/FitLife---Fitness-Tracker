import nodemailer from "nodemailer";

export const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_EMAIL,     
      pass: process.env.SMTP_PASSWORD,  
    },
  });

  const message = {
    from: `"Fitness Tracker Support" <${process.env.SMTP_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px; max-width: 500px;">
        <h2 style="color: #4f46e5;">Reset Your Password</h2>
        <p>You requested a password reset. Click the button below to set a new password:</p>
        <a href="${options.url}" style="background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">Reset Password</a>
        <p style="margin-top: 20px; color: #888; font-size: 12px;">If you didn't request this, please ignore this email.</p>
      </div>
    `,
  };

  // 3. Send the email
  await transporter.sendMail(message);
};