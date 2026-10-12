import nodemailer from 'nodemailer';

/**
 * Sends an email using Nodemailer (SMTP / Gmail / SendGrid / Ethereal)
 * If SMTP credentials are not configured, logs the email details in development mode.
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const isSmtpConfigured = process.env.SMTP_HOST && process.env.SMTP_USER;

    if (!isSmtpConfigured) {
      console.log('----------------------------------------------------');
      console.log('📧 [DEV EMAIL SIMULATOR] SMTP not configured in .env');
      console.log(`To:      ${to}`);
      console.log(`Subject: ${subject}`);
      console.log('----------------------------------------------------');
      return { success: true, simulated: true };
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const mailOptions = {
      from: `"${process.env.FROM_NAME || 'CampusMatrix'}" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
      to,
      subject,
      text: text || 'Please view this email in an HTML-capable client.',
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to ${to}. MessageId: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Failed to send email via SMTP:', error.message);
    throw new Error('Email delivery failed: ' + error.message);
  }
};

/**
 * Generates an HTML template for password reset emails
 */
export const getPasswordResetTemplate = ({ name, resetUrl }) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
          .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
          .header { background: #6366f1; padding: 28px; text-align: center; }
          .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; }
          .content { padding: 32px 28px; }
          .btn-container { text-align: center; margin: 32px 0; }
          .btn { background-color: #6366f1; color: #ffffff !important; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block; }
          .footer { padding: 20px 28px; background-color: #f1f5f9; text-align: center; font-size: 13px; color: #64748b; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>CampusMatrix</h1>
          </div>
          <div class="content">
            <h2>Reset Your Password</h2>
            <p>Hello ${name || 'Student'},</p>
            <p>We received a request to reset your password for your CampusMatrix account.</p>
            <p>Click the button below to set a new password. This link is valid for <strong>10 minutes</strong>.</p>
            <div class="btn-container">
              <a href="${resetUrl}" class="btn">Reset Password</a>
            </div>
            <p style="font-size: 13px; color: #64748b;">If the button does not work, copy and paste this link into your browser:</p>
            <p style="font-size: 13px; word-break: break-all; color: #6366f1;">${resetUrl}</p>
            <p style="font-size: 13px; color: #94a3b8; margin-top: 24px;">If you did not request a password reset, you can safely ignore this email.</p>
          </div>
          <div class="footer">
            &copy; ${new Date().getFullYear()} CampusMatrix. All rights reserved.
          </div>
        </div>
      </body>
    </html>
  `;
};
