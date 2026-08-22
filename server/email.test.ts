import { describe, expect, it, vi, beforeEach } from "vitest";
import { buildEmailContent, formatEmailTimestamp, sendCommentEmailNotification, TARGET_NOTIFICATION_EMAIL } from "./email";

describe("email module", () => {
  it("formats timestamp in IST format", () => {
    const testDate = new Date("2026-08-22T17:30:00.000Z");
    const formatted = formatEmailTimestamp(testDate);
    expect(formatted).toContain("IST");
  });

  it("builds exact required email structure", () => {
    const testDate = new Date("2026-08-22T17:30:00.000Z");
    const { subject, bodyText } = buildEmailContent("TGF Test", "Testing TGF Association email notifications.", testDate);

    expect(subject).toBe("New TGF Association Website Comment");
    expect(bodyText).toContain("New comment received from the TGF Association website.");
    expect(bodyText).toContain("Name:\nTGF Test");
    expect(bodyText).toContain("Comment:\nTesting TGF Association email notifications.");
    expect(bodyText).toContain("Date/Time:");
  });

  it("rejects empty name or comment", async () => {
    const res1 = await sendCommentEmailNotification({ name: "", message: "Hello" });
    expect(res1.success).toBe(false);

    const res2 = await sendCommentEmailNotification({ name: "Ramesh", message: "" });
    expect(res2.success).toBe(false);
  });
});
