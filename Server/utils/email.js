import crypto from "crypto";
import nodemailer from "nodemailer";

// 🔹 Generate Verification Token
export const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

// 🔹 Send Verification Email
export const sendVerificationEmail = async (to, fullname, token) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; background-color: #fafafa;">
        <h2 style="color: #4A90E2;">Hello ${fullname},</h2>
        <p style="font-size: 16px; line-height: 1.5;">
          Thank you for signing up! Please verify your email address to get started.
        </p>
        <a href="${verifyUrl}" 
           style="display: inline-block; padding: 12px 24px; margin: 20px 0; background-color: #4A90E2; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold;">
          Verify Email
        </a>
        <p style="font-size: 14px; color: #888;">
          If you did not create an account, you can safely ignore this email.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #aaa;">© ${new Date().getFullYear()} MaestroMap. All rights reserved.</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    to,
    subject: "Verify your Email ✨",
    html: htmlContent
  });
};
