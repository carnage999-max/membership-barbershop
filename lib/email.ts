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
      from: `Man Cave Barber Shop <${FROM_EMAIL}>`,
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

export function membershipActivatedEmail(firstName: string, planName: string, visitsPerMonth: number) {
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
      <h1 style="color: #FF3131; font-size: 32px; margin: 0 0 10px 0;">Performance Grade Activated!</h1>
      <div style="height: 3px; width: 100px; background: linear-gradient(to right, transparent, #FF3131, transparent); margin: 0 auto;"></div>
    </div>

    <!-- Content -->
    <div style="background-color: #1A1D23; border-radius: 12px; padding: 30px; margin-bottom: 30px; border: 1px solid #333;">
      <p style="font-size: 18px; line-height: 1.6; margin: 0 0 20px 0;">Hey ${firstName},</p>

      <p style="font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
        Welcome to <strong style="color: #FF3131;">Man Cave Barber Shop</strong>! Your <strong style="color: #FF3131;">${planName}</strong> performance grade is now active and ready for the road.
      </p>

      <div style="background-color: #0B0C10; border-left: 4px solid #FF3131; padding: 20px; margin: 20px 0;">
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 10px 0;"><strong>Package Specs:</strong></p>
        <ul style="margin: 0; padding-left: 20px;">
          <li style="margin-bottom: 8px;">${visitsPerMonth >= 99 ? 'Unlimited' : visitsPerMonth} high-performance visits per month</li>
          <li style="margin-bottom: 8px;">Real-time queue diagnostics</li>
          <li style="margin-bottom: 8px;">Priority pit lane access</li>
          <li style="margin-bottom: 8px;">Follow your master technicians</li>
        </ul>
      </div>

      <p style="font-size: 16px; line-height: 1.6; margin: 20px 0 0 0;">
        You can now enter any of our garage locations and enjoy master-level calibration and precision aesthetics.
      </p>
    </div>

    <!-- CTA Button -->
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/locations"
         style="display: inline-block; background-color: #FF3131; color: #FFFFFF; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-size: 16px; font-weight: 800; text-transform: uppercase; font-style: italic;">
        Find a Garage
      </a>
    </div>

    <!-- Footer -->
    <div style="text-align: center; color: #A8B2C1; font-size: 14px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #333;">
      <p style="margin: 0 0 10px 0; font-weight: bold; color: #F4F1EA;">Man Cave Barber Shop</p>
      <p style="margin: 0;">High Performance Haircuts. Engineered Aesthetics.</p>
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
      <h1 style="color: #00FF00; font-size: 32px; margin: 0 0 10px 0;">Transaction Completed</h1>
    </div>

    <div style="background-color: #1A1D23; border-radius: 12px; padding: 30px; margin-bottom: 30px; border: 1px solid #333;">
      <p style="font-size: 18px; line-height: 1.6; margin: 0 0 20px 0;">Hi ${firstName},</p>

      <p style="font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
        Your performance fuel has been processed successfully.
      </p>

      <div style="background-color: #0B0C10; padding: 20px; border-radius: 8px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; color: #A8B2C1; opacity: 0.7;">Amount</td>
            <td style="padding: 10px 0; text-align: right; font-weight: 600; font-size: 18px; color: #FF3131;">$${amount.toFixed(2)}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #A8B2C1; opacity: 0.7;">Description</td>
            <td style="padding: 10px 0; text-align: right; color: #F4F1EA;">${description}</td>
          </tr>
        </table>
      </div>
    </div>

    <div style="text-align: center; color: #A8B2C1; font-size: 14px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #333;">
      <p style="margin: 0 0 10px 0; font-weight: bold; color: #F4F1EA;">Man Cave Barber Shop</p>
      <p style="margin: 0;">Questions? Reply to this bulletin or visit our garage support page.</p>
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
      <h1 style="color: #FF3131; font-size: 32px; margin: 0 0 10px 0;">Queue Calibration</h1>
    </div>

    <div style="background-color: #1A1D23; border-radius: 12px; padding: 30px; margin-bottom: 30px; border: 1px solid #333;">
      <p style="font-size: 18px; line-height: 1.6; margin: 0 0 20px 0;">Hi ${firstName},</p>

      <p style="font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
        Your position in the pit lane at <strong style="color: #FF3131;">${locationName}</strong> has been updated.
      </p>

      <div style="text-align: center; background-color: #0B0C10; padding: 30px; border-radius: 8px; margin: 20px 0; border: 1px solid #FF3131;">
        <div style="font-size: 48px; font-weight: bold; color: #FF3131; margin-bottom: 10px;">#${position}</div>
        <div style="font-size: 16px; color: #A8B2C1;">Current Position</div>
        <div style="margin-top: 20px; font-size: 24px; color: #F4F1EA;">${estimatedWait} min</div>
        <div style="font-size: 14px; opacity: 0.7; color: #A8B2C1;">Estimated Wait</div>
      </div>

      <p style="font-size: 16px; line-height: 1.6; margin: 20px 0 0 0; text-align: center; color: #A8B2C1;">
        We'll signal you when the bay is open!
      </p>
    </div>

    <div style="text-align: center; color: #A8B2C1; font-size: 14px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #333;">
      <p style="margin: 0; font-weight: bold; color: #F4F1EA;">Man Cave Barber Shop</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}
