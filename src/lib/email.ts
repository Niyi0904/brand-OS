import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
  from?: string;
};

export async function sendEmail({ to, subject, html, from }: SendEmailParams) {
  const fromEmail = from ?? process.env.RESEND_FROM_EMAIL ?? "noreply@marketingos.com";

  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to,
    subject,
    html,
  });

  if (error) {
    console.error("Failed to send email:", error);
    throw new Error(error.message ?? "Failed to send email");
  }

  return data;
}

export async function sendWelcomeEmail({ to, name }: { to: string; name?: string }) {
  const displayName = name ?? "there";

  return sendEmail({
    to,
    subject: "Welcome to MarketingOS!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <h1 style="color: #111; font-size: 24px;">Welcome to MarketingOS, ${displayName}!</h1>
        <p style="font-size: 16px; line-height: 1.6;">
          We're excited to have you on board. MarketingOS helps you build brands, create AI-powered marketing content, and grow your business.
        </p>
        <p style="font-size: 16px; line-height: 1.6;">
          To get started, log in to your dashboard and create your first brand.
        </p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/dashboard"
           style="display: inline-block; margin-top: 20px; padding: 12px 24px; background-color: #111; color: #fff; text-decoration: none; border-radius: 6px; font-size: 16px;">
          Go to Dashboard
        </a>
        <p style="margin-top: 30px; font-size: 14px; color: #888;">
          If you have any questions, just reply to this email.
        </p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail({
  to,
  resetUrl,
}: {
  to: string;
  resetUrl: string;
}) {
  return sendEmail({
    to,
    subject: "Reset your MarketingOS password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <h1 style="color: #111; font-size: 24px;">Reset your password</h1>
        <p style="font-size: 16px; line-height: 1.6;">
          We received a request to reset your password. Click the button below to choose a new one.
        </p>
        <a href="${resetUrl}"
           style="display: inline-block; margin-top: 20px; padding: 12px 24px; background-color: #111; color: #fff; text-decoration: none; border-radius: 6px; font-size: 16px;">
          Reset Password
        </a>
        <p style="margin-top: 30px; font-size: 14px; color: #888;">
          This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.
        </p>
      </div>
    `,
  });
}

export async function sendPaymentFailedEmail({
  to,
  organizationName,
}: {
  to: string;
  organizationName: string;
}) {
  return sendEmail({
    to,
    subject: `Payment failed for ${organizationName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <h1 style="color: #111; font-size: 24px;">Payment failed</h1>
        <p style="font-size: 16px; line-height: 1.6;">
          We were unable to process the payment for your organization <strong>${organizationName}</strong>.
        </p>
        <p style="font-size: 16px; line-height: 1.6;">
          Please update your payment method to avoid service interruption.
        </p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/dashboard/billing"
           style="display: inline-block; margin-top: 20px; padding: 12px 24px; background-color: #111; color: #fff; text-decoration: none; border-radius: 6px; font-size: 16px;">
          Update Payment Method
        </a>
        <p style="margin-top: 30px; font-size: 14px; color: #888;">
          If you believe this is an error, please contact us.
        </p>
      </div>
    `,
  });
}