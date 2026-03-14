import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.EMAIL_FROM || 'info@nathanreardon.com';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });

    return { success: true, data };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
}

// ============================================
// EMAIL TEMPLATES
// ============================================

export function membershipActivatedEmail(firstName: string, planName: string, cutsPerMonth: number) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: system-ui, -apple-system, sans-serif; background-color: #0B0C10; color: #F4F1EA; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 40px;">
      <h1 style="color: #C8A24A; font-size: 32px; margin: 0 0 10px 0;">Membership Activated!</h1>
      <div style="height: 3px; width: 100px; background: linear-gradient(to right, transparent, #C8A24A, transparent); margin: 0 auto;"></div>
    </div>

    <!-- Content -->
    <div style="background-color: #2A2E36; border-radius: 12px; padding: 30px; margin-bottom: 30px;">
      <p style="font-size: 18px; line-height: 1.6; margin: 0 0 20px 0;">Hey ${firstName},</p>

      <p style="font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
        Welcome to Membership Barbershop! Your <strong style="color: #C8A24A;">${planName}</strong> membership is now active.
      </p>

      <div style="background-color: #0B0C10; border-left: 4px solid #C8A24A; padding: 20px; margin: 20px 0;">
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 10px 0;"><strong>Your Plan Includes:</strong></p>
        <ul style="margin: 0; padding-left: 20px;">
          <li style="margin-bottom: 8px;">${cutsPerMonth} cuts per month</li>
          <li style="margin-bottom: 8px;">Real-time queue tracking</li>
          <li style="margin-bottom: 8px;">Priority check-in access</li>
          <li style="margin-bottom: 8px;">Follow your favorite stylists</li>
        </ul>
      </div>

      <p style="font-size: 16px; line-height: 1.6; margin: 20px 0 0 0;">
        You can now check in to any of our locations and enjoy precision fast, lounge-level luxury service.
      </p>
    </div>

    <!-- CTA Button -->
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/locations"
         style="display: inline-block; background-color: #B11226; color: #F4F1EA; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-size: 16px; font-weight: 600;">
        Find a Location
      </a>
    </div>

    <!-- Footer -->
    <div style="text-align: center; color: #F4F1EA; opacity: 0.7; font-size: 14px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #2A2E36;">
      <p style="margin: 0 0 10px 0;">Membership Barbershop</p>
      <p style="margin: 0;">Precision Fast. Lounge-Level Luxury.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

export function paymentSuccessEmail(firstName: string, amount: number, description: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: system-ui, -apple-system, sans-serif; background-color: #0B0C10; color: #F4F1EA; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="text-align: center; margin-bottom: 40px;">
      <h1 style="color: #1F8A70; font-size: 32px; margin: 0 0 10px 0;">Payment Confirmed</h1>
    </div>

    <div style="background-color: #2A2E36; border-radius: 12px; padding: 30px; margin-bottom: 30px;">
      <p style="font-size: 18px; line-height: 1.6; margin: 0 0 20px 0;">Hi ${firstName},</p>

      <p style="font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
        Your payment has been processed successfully.
      </p>

      <div style="background-color: #0B0C10; padding: 20px; border-radius: 8px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; color: #F4F1EA; opacity: 0.7;">Amount</td>
            <td style="padding: 10px 0; text-align: right; font-weight: 600; font-size: 18px;">$${amount.toFixed(2)}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #F4F1EA; opacity: 0.7;">Description</td>
            <td style="padding: 10px 0; text-align: right;">${description}</td>
          </tr>
        </table>
      </div>
    </div>

    <div style="text-align: center; color: #F4F1EA; opacity: 0.7; font-size: 14px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #2A2E36;">
      <p style="margin: 0 0 10px 0;">Membership Barbershop</p>
      <p style="margin: 0;">Questions? Reply to this email or visit our support page.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

export function queueUpdateEmail(firstName: string, position: number, estimatedWait: number, locationName: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: system-ui, -apple-system, sans-serif; background-color: #0B0C10; color: #F4F1EA; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="text-align: center; margin-bottom: 40px;">
      <h1 style="color: #C8A24A; font-size: 32px; margin: 0 0 10px 0;">Queue Update</h1>
    </div>

    <div style="background-color: #2A2E36; border-radius: 12px; padding: 30px; margin-bottom: 30px;">
      <p style="font-size: 18px; line-height: 1.6; margin: 0 0 20px 0;">Hi ${firstName},</p>

      <p style="font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
        Your position in the queue at <strong style="color: #C8A24A;">${locationName}</strong> has been updated.
      </p>

      <div style="text-align: center; background-color: #0B0C10; padding: 30px; border-radius: 8px; margin: 20px 0;">
        <div style="font-size: 48px; font-weight: bold; color: #C8A24A; margin-bottom: 10px;">#${position}</div>
        <div style="font-size: 16px; opacity: 0.7;">Current Position</div>
        <div style="margin-top: 20px; font-size: 24px; color: #F4F1EA;">${estimatedWait} min</div>
        <div style="font-size: 14px; opacity: 0.7;">Estimated Wait</div>
      </div>

      <p style="font-size: 16px; line-height: 1.6; margin: 20px 0 0 0; text-align: center;">
        We'll notify you when it's your turn!
      </p>
    </div>

    <div style="text-align: center; color: #F4F1EA; opacity: 0.7; font-size: 14px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #2A2E36;">
      <p style="margin: 0;">Membership Barbershop</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}
