import { sendCommentEmailNotification, TARGET_NOTIFICATION_EMAIL } from "../server/email";

async function runTest() {
  console.log("==================================================");
  console.log("TGF ASSOCIATION EMAIL BACKEND TEST");
  console.log("==================================================");
  console.log(`Target destination: ${TARGET_NOTIFICATION_EMAIL}`);
  console.log("Subject: TGF Association Email Test");
  console.log("Body: This is a test of the TGF Association website email notification system.\n");

  const result = await sendCommentEmailNotification({
    name: "TGF Test",
    message: "This is a test of the TGF Association website email notification system.",
    customSubject: "TGF Association Email Test",
    customBody: "This is a test of the TGF Association website email notification system.",
  });

  console.log("==================================================");
  console.log("DELIVERY TEST RESULT:");
  console.log("Success:", result.success ? "YES" : "NO");
  if (result.provider) console.log("Provider Used:", result.provider);
  if (result.messageId) console.log("Message ID:", result.messageId);
  if (result.error) console.log("Error Detail:", result.error);
  console.log("==================================================");

  if (!result.success) {
    console.log("\nACTION REQUIRED ON RENDER:");
    console.log("Add ONE of the following email provider setups in:");
    console.log("Render Dashboard -> tgf-association service -> Environment -> Environment Variables\n");
    console.log("Option 1 (Gmail SMTP):");
    console.log("  SMTP_USER = tgfassociation@gmail.com");
    console.log("  SMTP_PASS = [your 16-character Google App Password]");
    console.log("  SMTP_HOST = smtp.gmail.com");
    console.log("  SMTP_PORT = 465");
    console.log("  SMTP_SECURE = true\n");
    console.log("Option 2 (Resend API):");
    console.log("  RESEND_API_KEY = [your Resend API key from resend.com]");
  }
}

runTest().catch(console.error);
