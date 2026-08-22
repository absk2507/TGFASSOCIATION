import nodemailer from "nodemailer";
import { notifyOwner } from "./_core/notification";

export interface CommentEmailPayload {
  name: string;
  message: string;
  submittedAt?: Date;
}

export const TARGET_NOTIFICATION_EMAIL = "tgfassociation@gmail.com";

/**
 * Sends an email notification to tgfassociation@gmail.com when a new comment is submitted.
 */
export async function sendCommentEmailNotification(payload: CommentEmailPayload): Promise<boolean> {
  const name = payload.name.trim();
  const message = payload.message.trim();
  const date = payload.submittedAt || new Date();
  
  const formattedDateTime = date.toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }) + " (IST)";

  const subject = "New TGF Association Website Comment";
  const bodyText = `New comment received from the TGF Association website.

Name:
${name}

Comment:
${message}

Date/Time:
${formattedDateTime}`;

  let deliverySuccess = false;

  // 1. If SMTP credentials are provided, dispatch through SMTP (e.g. Gmail, SendGrid, SES, Brevo, etc.)
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (smtpHost && smtpUser && smtpPass) {
    try {
      const port = parseInt(process.env.SMTP_PORT || "587", 10);
      const secure = process.env.SMTP_SECURE === "true" || port === 465;
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port,
        secure,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const fromAddress = process.env.EMAIL_FROM || `"TGF Association Website" <${smtpUser}>`;
      const toAddress = process.env.NOTIFICATION_EMAIL || TARGET_NOTIFICATION_EMAIL;

      await transporter.sendMail({
        from: fromAddress,
        to: toAddress,
        subject,
        text: bodyText,
      });

      console.info(`[Email Service] Successfully sent comment notification via SMTP to ${toAddress}`);
      deliverySuccess = true;
    } catch (smtpError) {
      console.error("[Email Service] SMTP delivery failed:", (smtpError as Error).message);
    }
  }

  // 2. Also forward through the built-in notification service if configured
  try {
    const notified = await notifyOwner({
      title: subject,
      content: bodyText,
    });
    if (notified) {
      deliverySuccess = true;
    }
  } catch (notifyError) {
    console.warn("[Email Service] Built-in notification service failed:", (notifyError as Error).message);
  }

  // 3. In development / mock mode (where external SMTP is not configured), treat successful log as success
  if (!smtpHost && !process.env.BUILT_IN_FORGE_API_KEY) {
    console.info(`[Email Service Mock] Destination: ${TARGET_NOTIFICATION_EMAIL}\nSubject: ${subject}\n\n${bodyText}`);
    deliverySuccess = true;
  }

  return deliverySuccess;
}
