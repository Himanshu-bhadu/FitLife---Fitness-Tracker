import nodemailer from "nodemailer";

export const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,                 // Go back to 587 (TLS)
    secure: false,             // Must be false for 587
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
    tls: {
      // ⚠️ THIS IS THE BYPASS FIX:
      rejectUnauthorized: false, // Don't fail if the certificate looks weird
      ciphers: "SSLv3",          // Force an older cipher that sometimes bypasses blocks
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

  try {
    await transporter.sendMail(message);
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Critical Email Error:", error);
    throw error; // Let the controller know it failed
  }
};