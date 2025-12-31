import { Resend } from 'resend';

export const sendEmail = async (options) => {
  const resend = new Resend(process.env.RESEND_API_KEY);

  console.log("📧 Sending email via Resend...");
  console.log("To:", options.email);

  try {
    const { data, error } = await resend.emails.send({
      from: 'Fitness Tracker <onboarding@resend.dev>', // This works immediately
      to: options.email,
      subject: options.subject,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px; max-width: 500px;">
          <h2 style="color: #4f46e5;">Reset Your Password</h2>
          <p>You requested a password reset. Click the button below to set a new password:</p>
          <a href="${options.url}" style="background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">Reset Password</a>
          <p style="color: #666; margin-top: 20px; font-size: 12px;">If you didn't request this, please ignore this email.</p>
          <p style="color: #666; font-size: 12px;">This link expires in 10 minutes.</p>
        </div>
      `,
    });

    if (error) {
      console.error("❌ Resend error:", error);
      throw error;
    }

    console.log("✅ Email sent successfully!", data);
    return data;
  } catch (error) {
    console.error("❌ Failed to send email:", error);
    throw new Error("Failed to send email");
  }
};